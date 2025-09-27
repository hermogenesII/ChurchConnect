

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."application_status" AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'ADDITIONAL_INFO_NEEDED'
);


ALTER TYPE "public"."application_status" OWNER TO "postgres";


CREATE TYPE "public"."content_visibility" AS ENUM (
    'PUBLIC',
    'MEMBERS',
    'ADMIN'
);


ALTER TYPE "public"."content_visibility" OWNER TO "postgres";


CREATE TYPE "public"."event_type" AS ENUM (
    'SERVICE',
    'BIBLE_STUDY',
    'FELLOWSHIP',
    'OUTREACH',
    'MEETING',
    'SPECIAL',
    'OTHER'
);


ALTER TYPE "public"."event_type" OWNER TO "postgres";


CREATE TYPE "public"."invitation_status" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE "public"."invitation_status" OWNER TO "postgres";


CREATE TYPE "public"."prayer_privacy" AS ENUM (
    'PUBLIC',
    'LEADERSHIP',
    'PRIVATE'
);


ALTER TYPE "public"."prayer_privacy" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'MEMBER',
    'CHURCH_ADMIN',
    'SYSTEM_ADMIN'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."approve_church_application"("p_application_id" "uuid", "p_approval_notes" "text" DEFAULT NULL::"text") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    app_record church_applications%ROWTYPE;
    new_church_id UUID;
    new_user_id UUID;
    generated_password TEXT;
    church_slug TEXT;
BEGIN
    -- Check if current user is system admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'SYSTEM_ADMIN'
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Unauthorized. Only system administrators can approve applications.'
        );
    END IF;

    -- Get application record
    SELECT * INTO app_record FROM church_applications WHERE id = p_application_id;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Application not found.'
        );
    END IF;

    IF app_record.status != 'PENDING' AND app_record.status != 'UNDER_REVIEW' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Application has already been processed.'
        );
    END IF;

    -- Generate church slug
    SELECT generate_church_slug(app_record.church_name) INTO church_slug;

    -- Create church
    INSERT INTO churches (name, slug, settings)
    VALUES (
        app_record.church_name,
        church_slug,
        json_build_object(
            'denomination', app_record.church_denomination,
            'address', app_record.church_address,
            'city', app_record.church_city,
            'state', app_record.church_state,
            'zip', app_record.church_zip,
            'phone', app_record.church_phone,
            'email', app_record.church_email,
            'website', app_record.church_website,
            'founded_year', app_record.church_founded_year,
            'congregation_size', app_record.estimated_congregation_size
        )
    ) RETURNING id INTO new_church_id;

    -- Handle user creation based on application type
    IF app_record.application_type = 'NEW_USER' THEN
        -- Generate temporary password
        generated_password := substr(md5(random()::text), 1, 12);

        -- Create new user account
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            app_record.applicant_email,
            crypt(generated_password, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            json_build_object(
                'name', app_record.applicant_name,
                'role', 'CHURCH_ADMIN'
            )
        ) RETURNING id INTO new_user_id;

        -- Update profile
        UPDATE profiles
        SET
            church_id = new_church_id,
            role = 'CHURCH_ADMIN',
            phone = app_record.applicant_phone
        WHERE id = new_user_id;

    ELSE
        -- Existing user - upgrade their role
        new_user_id := app_record.applicant_user_id;

        UPDATE profiles
        SET
            church_id = new_church_id,
            role = 'CHURCH_ADMIN'
        WHERE id = new_user_id;
    END IF;

    -- Update application status
    UPDATE church_applications
    SET
        status = 'APPROVED',
        reviewed_by = auth.uid(),
        reviewed_at = NOW(),
        approval_notes = p_approval_notes,
        created_church_id = new_church_id,
        created_admin_user_id = new_user_id,
        updated_at = NOW()
    WHERE id = p_application_id;

    RETURN json_build_object(
        'success', true,
        'church_id', new_church_id,
        'admin_user_id', new_user_id,
        'church_slug', church_slug,
        'generated_password', CASE WHEN app_record.application_type = 'NEW_USER' THEN generated_password ELSE null END,
        'message', 'Church application approved successfully!'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', 'Failed to approve application: ' || SQLERRM
    );
END;
$$;


ALTER FUNCTION "public"."approve_church_application"("p_application_id" "uuid", "p_approval_notes" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_church_invitation"("p_church_id" "uuid", "p_email" "text", "p_role" "public"."user_role" DEFAULT 'MEMBER'::"public"."user_role", "p_message" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    invitation_id UUID;
    inviter_profile profiles%ROWTYPE;
BEGIN
    -- Get the inviter's profile
    SELECT * INTO inviter_profile
    FROM profiles
    WHERE id = auth.uid();

    -- Check if inviter is admin of the church
    IF inviter_profile.church_id != p_church_id OR
       inviter_profile.role NOT IN ('CHURCH_ADMIN', 'SYSTEM_ADMIN') THEN
        RAISE EXCEPTION 'Unauthorized: Only church admins can send invitations';
    END IF;

    -- Check for existing pending invitation
    IF EXISTS (
        SELECT 1 FROM church_invitations
        WHERE church_id = p_church_id
          AND email = p_email
          AND status = 'PENDING'
    ) THEN
        RAISE EXCEPTION 'Invitation already pending for this email';
    END IF;

    -- Create the invitation
    INSERT INTO church_invitations (
        church_id, invited_by, email, role, message
    ) VALUES (
        p_church_id, auth.uid(), p_email, p_role, p_message
    ) RETURNING id INTO invitation_id;

    RETURN invitation_id;
END;
$$;


ALTER FUNCTION "public"."create_church_invitation"("p_church_id" "uuid", "p_email" "text", "p_role" "public"."user_role", "p_message" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_church_slug"("p_church_name" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Create base slug from church name
    base_slug := lower(trim(p_church_name));
    base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(base_slug, '-');

    -- Limit length
    base_slug := substring(base_slug from 1 for 50);

    final_slug := base_slug;

    -- Check availability and add number if needed
    WHILE EXISTS (SELECT 1 FROM churches WHERE slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;

    RETURN final_slug;
END;
$$;


ALTER FUNCTION "public"."generate_church_slug"("p_church_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_church_stats"("p_church_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_members', (
            SELECT COUNT(*) FROM profiles WHERE church_id = p_church_id
        ),
        'total_events', (
            SELECT COUNT(*) FROM church_events WHERE church_id = p_church_id
        ),
        'total_sermons', (
            SELECT COUNT(*) FROM church_sermons WHERE church_id = p_church_id
        ),
        'total_posts', (
            SELECT COUNT(*) FROM church_posts WHERE church_id = p_church_id AND published = true
        ),
        'active_prayer_requests', (
            SELECT COUNT(*) FROM prayer_requests
            WHERE church_id = p_church_id AND is_answered = false AND expires_at > NOW()
        ),
        'total_groups', (
            SELECT COUNT(*) FROM church_groups WHERE church_id = p_church_id
        )
    ) INTO stats;

    RETURN stats;
END;
$$;


ALTER FUNCTION "public"."get_church_stats"("p_church_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_profile"("user_id" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("id" "uuid", "email" "text", "name" "text", "role" "public"."user_role", "church_id" "uuid", "church_name" "text", "avatar_url" "text", "phone" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.name,
    p.role,
    p.church_id,
    c.name as church_name,
    p.avatar_url,
    p.phone,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.churches c ON p.church_id = c.id
  WHERE p.id = user_id;
END;
$$;


ALTER FUNCTION "public"."get_user_profile"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_invitation_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    invitation_record church_invitations%ROWTYPE;
    invitation_token_param TEXT;
BEGIN
    -- Get invitation token from user metadata
    invitation_token_param := NEW.raw_user_meta_data->>'invitation_token';

    IF invitation_token_param IS NOT NULL THEN
        -- Find and validate the invitation
        SELECT * INTO invitation_record
        FROM church_invitations
        WHERE invitation_token = invitation_token_param::UUID
          AND status = 'PENDING'
          AND expires_at > NOW()
          AND email = NEW.email;

        IF FOUND THEN
            -- Update the invitation status
            UPDATE church_invitations
            SET status = 'ACCEPTED',
                accepted_at = NOW()
            WHERE id = invitation_record.id;

            -- Set church_id and role in the new profile
            UPDATE profiles
            SET church_id = invitation_record.church_id,
                role = invitation_record.role
            WHERE id = NEW.id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_invitation_signup"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_role_meta text;
BEGIN
  -- Get role from user metadata (if set during registration)
  user_role_meta := COALESCE(new.raw_user_meta_data->>'role', 'MEMBER');
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    user_role_meta::user_role
  );
  
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_church_application_existing_user"("p_church_name" "text", "p_church_denomination" "text" DEFAULT NULL::"text", "p_church_address" "text" DEFAULT NULL::"text", "p_church_city" "text" DEFAULT NULL::"text", "p_church_state" "text" DEFAULT NULL::"text", "p_church_zip" "text" DEFAULT NULL::"text", "p_church_phone" "text" DEFAULT NULL::"text", "p_church_email" "text" DEFAULT NULL::"text", "p_church_website" "text" DEFAULT NULL::"text", "p_church_founded_year" integer DEFAULT NULL::integer, "p_estimated_congregation_size" integer DEFAULT NULL::integer, "p_current_church_software" "text" DEFAULT NULL::"text", "p_leadership_position" "text" DEFAULT 'Pastor'::"text", "p_years_in_position" integer DEFAULT NULL::integer, "p_leadership_verification_method" "text" DEFAULT NULL::"text", "p_motivation" "text" DEFAULT NULL::"text", "p_current_challenges" "text" DEFAULT NULL::"text", "p_applicant_title" "text" DEFAULT 'Pastor'::"text") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    application_id UUID;
    user_profile profiles%ROWTYPE;
BEGIN
    -- Get current user profile
    SELECT * INTO user_profile FROM profiles WHERE id = auth.uid();

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found. Please make sure you are signed in.'
        );
    END IF;

    -- Check if user already has a church (is already church admin)
    IF user_profile.church_id IS NOT NULL AND user_profile.role IN ('CHURCH_ADMIN', 'SYSTEM_ADMIN') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'You are already a church administrator. Contact support if you need to manage multiple churches.'
        );
    END IF;

    -- Check for existing pending application
    IF EXISTS (
        SELECT 1 FROM church_applications
        WHERE applicant_user_id = auth.uid()
        AND status IN ('PENDING', 'UNDER_REVIEW', 'ADDITIONAL_INFO_NEEDED')
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'You already have a pending church application.'
        );
    END IF;

    -- Create the application
    INSERT INTO church_applications (
        application_type,
        applicant_user_id,
        applicant_name,
        applicant_email,
        applicant_phone,
        applicant_title,
        church_name,
        church_denomination,
        church_address,
        church_city,
        church_state,
        church_zip,
        church_phone,
        church_email,
        church_website,
        church_founded_year,
        estimated_congregation_size,
        current_church_software,
        leadership_position,
        years_in_position,
        leadership_verification_method,
        motivation,
        current_challenges
    ) VALUES (
        'EXISTING_USER',
        auth.uid(),
        user_profile.name,
        user_profile.email,
        user_profile.phone,
        p_applicant_title,
        p_church_name,
        p_church_denomination,
        p_church_address,
        p_church_city,
        p_church_state,
        p_church_zip,
        p_church_phone,
        p_church_email,
        p_church_website,
        p_church_founded_year,
        p_estimated_congregation_size,
        p_current_church_software,
        p_leadership_position,
        p_years_in_position,
        p_leadership_verification_method,
        p_motivation,
        p_current_challenges
    ) RETURNING id INTO application_id;

    RETURN json_build_object(
        'success', true,
        'application_id', application_id,
        'message', 'Church application submitted successfully! We will review your application and contact you within 2-3 business days.'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', 'Failed to submit application: ' || SQLERRM
    );
END;
$$;


ALTER FUNCTION "public"."submit_church_application_existing_user"("p_church_name" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text", "p_applicant_title" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_church_application_new_user"("p_applicant_name" "text", "p_applicant_email" "text", "p_church_name" "text", "p_applicant_phone" "text" DEFAULT NULL::"text", "p_applicant_title" "text" DEFAULT 'Pastor'::"text", "p_church_denomination" "text" DEFAULT NULL::"text", "p_church_address" "text" DEFAULT NULL::"text", "p_church_city" "text" DEFAULT NULL::"text", "p_church_state" "text" DEFAULT NULL::"text", "p_church_zip" "text" DEFAULT NULL::"text", "p_church_phone" "text" DEFAULT NULL::"text", "p_church_email" "text" DEFAULT NULL::"text", "p_church_website" "text" DEFAULT NULL::"text", "p_church_founded_year" integer DEFAULT NULL::integer, "p_estimated_congregation_size" integer DEFAULT NULL::integer, "p_current_church_software" "text" DEFAULT NULL::"text", "p_leadership_position" "text" DEFAULT 'Senior Pastor'::"text", "p_years_in_position" integer DEFAULT NULL::integer, "p_leadership_verification_method" "text" DEFAULT NULL::"text", "p_motivation" "text" DEFAULT NULL::"text", "p_current_challenges" "text" DEFAULT NULL::"text") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    application_id UUID;
BEGIN
    -- Check if email is already registered
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_applicant_email) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Email already registered. Please sign in first and apply as an existing user.'
        );
    END IF;

    -- Check for existing pending application with same email
    IF EXISTS (
        SELECT 1 FROM church_applications
        WHERE applicant_email = p_applicant_email
        AND status IN ('PENDING', 'UNDER_REVIEW', 'ADDITIONAL_INFO_NEEDED')
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'You already have a pending application. Please check your email for updates.'
        );
    END IF;

    -- Create the application
    INSERT INTO church_applications (
        application_type,
        applicant_name,
        applicant_email,
        applicant_phone,
        applicant_title,
        church_name,
        church_denomination,
        church_address,
        church_city,
        church_state,
        church_zip,
        church_phone,
        church_email,
        church_website,
        church_founded_year,
        estimated_congregation_size,
        current_church_software,
        leadership_position,
        years_in_position,
        leadership_verification_method,
        motivation,
        current_challenges
    ) VALUES (
        'NEW_USER',
        p_applicant_name,
        p_applicant_email,
        p_applicant_phone,
        p_applicant_title,
        p_church_name,
        p_church_denomination,
        p_church_address,
        p_church_city,
        p_church_state,
        p_church_zip,
        p_church_phone,
        p_church_email,
        p_church_website,
        p_church_founded_year,
        p_estimated_congregation_size,
        p_current_church_software,
        p_leadership_position,
        p_years_in_position,
        p_leadership_verification_method,
        p_motivation,
        p_current_challenges
    ) RETURNING id INTO application_id;

    RETURN json_build_object(
        'success', true,
        'application_id', application_id,
        'message', 'Church application submitted successfully! We will review your application and contact you within 2-3 business days.'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', 'Failed to submit application: ' || SQLERRM
    );
END;
$$;


ALTER FUNCTION "public"."submit_church_application_new_user"("p_applicant_name" "text", "p_applicant_email" "text", "p_church_name" "text", "p_applicant_phone" "text", "p_applicant_title" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  calling_user_role user_role;
BEGIN
  -- Get the role of the user making the request
  SELECT role INTO calling_user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Only SYSTEM_ADMIN can change roles
  IF calling_user_role != 'SYSTEM_ADMIN' THEN
    RAISE EXCEPTION 'Only system administrators can change user roles';
  END IF;
  
  -- Update the user's role
  UPDATE public.profiles
  SET role = new_role, updated_at = NOW()
  WHERE id = user_id;
END;
$$;


ALTER FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."church_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "application_type" "text" NOT NULL,
    "applicant_user_id" "uuid",
    "applicant_name" "text" NOT NULL,
    "applicant_email" "text" NOT NULL,
    "applicant_phone" "text",
    "applicant_title" "text",
    "church_name" "text" NOT NULL,
    "church_denomination" "text",
    "church_address" "text",
    "church_city" "text",
    "church_state" "text",
    "church_zip" "text",
    "church_phone" "text",
    "church_email" "text",
    "church_website" "text",
    "church_founded_year" integer,
    "estimated_congregation_size" integer,
    "current_church_software" "text",
    "leadership_position" "text" NOT NULL,
    "years_in_position" integer,
    "leadership_verification_method" "text",
    "motivation" "text",
    "current_challenges" "text",
    "status" "public"."application_status" DEFAULT 'PENDING'::"public"."application_status",
    "submitted_at" timestamp with time zone DEFAULT "now"(),
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "approval_notes" "text",
    "rejection_reason" "text",
    "created_church_id" "uuid",
    "created_admin_user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "church_applications_application_type_check" CHECK (("application_type" = ANY (ARRAY['NEW_USER'::"text", 'EXISTING_USER'::"text"])))
);


ALTER TABLE "public"."church_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."church_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "church_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "event_type" "public"."event_type" DEFAULT 'OTHER'::"public"."event_type",
    "visibility" "public"."content_visibility" DEFAULT 'PUBLIC'::"public"."content_visibility",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone,
    "location" "text",
    "max_attendees" integer,
    "requires_rsvp" boolean DEFAULT false,
    "image_url" "text",
    "external_link" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."church_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."church_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "church_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "group_type" "text",
    "meeting_day" "text",
    "meeting_time" time without time zone,
    "meeting_location" "text",
    "max_members" integer,
    "is_open" boolean DEFAULT true,
    "requires_approval" boolean DEFAULT false,
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."church_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."church_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "church_id" "uuid" NOT NULL,
    "invited_by" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "public"."user_role" DEFAULT 'MEMBER'::"public"."user_role",
    "invitation_token" "uuid" DEFAULT "gen_random_uuid"(),
    "status" "public"."invitation_status" DEFAULT 'PENDING'::"public"."invitation_status",
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval),
    "accepted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "message" "text"
);


ALTER TABLE "public"."church_invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."church_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "church_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "excerpt" "text",
    "slug" "text",
    "visibility" "public"."content_visibility" DEFAULT 'PUBLIC'::"public"."content_visibility",
    "featured" boolean DEFAULT false,
    "published" boolean DEFAULT false,
    "published_at" timestamp with time zone,
    "image_url" "text",
    "tags" "text"[],
    "view_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."church_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."church_sermons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "church_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "speaker" "text" NOT NULL,
    "series_name" "text",
    "scripture_reference" "text",
    "visibility" "public"."content_visibility" DEFAULT 'PUBLIC'::"public"."content_visibility",
    "sermon_date" "date" NOT NULL,
    "duration_minutes" integer,
    "audio_url" "text",
    "video_url" "text",
    "transcript" "text",
    "notes_url" "text",
    "view_count" integer DEFAULT 0,
    "featured" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."church_sermons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."churches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text",
    "settings" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."churches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_rsvps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'yes'::"text",
    "guests_count" integer DEFAULT 0,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "event_rsvps_status_check" CHECK (("status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'maybe'::"text"])))
);


ALTER TABLE "public"."event_rsvps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'MEMBER'::"text",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "group_members_role_check" CHECK (("role" = ANY (ARRAY['MEMBER'::"text", 'LEADER'::"text", 'ADMIN'::"text"])))
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prayer_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "church_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "privacy" "public"."prayer_privacy" DEFAULT 'PUBLIC'::"public"."prayer_privacy",
    "is_answered" boolean DEFAULT false,
    "answered_at" timestamp with time zone,
    "answer_note" "text",
    "expires_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."prayer_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prayer_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "prayer_request_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_praying" boolean DEFAULT true,
    "encouragement_note" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."prayer_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "name" "text",
    "role" "public"."user_role" DEFAULT 'MEMBER'::"public"."user_role",
    "church_id" "uuid",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "phone" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."church_applications"
    ADD CONSTRAINT "church_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."church_events"
    ADD CONSTRAINT "church_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."church_groups"
    ADD CONSTRAINT "church_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."church_invitations"
    ADD CONSTRAINT "church_invitations_church_id_email_status_key" UNIQUE ("church_id", "email", "status");



ALTER TABLE ONLY "public"."church_invitations"
    ADD CONSTRAINT "church_invitations_invitation_token_key" UNIQUE ("invitation_token");



ALTER TABLE ONLY "public"."church_invitations"
    ADD CONSTRAINT "church_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."church_posts"
    ADD CONSTRAINT "church_posts_church_id_slug_key" UNIQUE ("church_id", "slug");



ALTER TABLE ONLY "public"."church_posts"
    ADD CONSTRAINT "church_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."church_sermons"
    ADD CONSTRAINT "church_sermons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."churches"
    ADD CONSTRAINT "churches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."churches"
    ADD CONSTRAINT "churches_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_user_id_key" UNIQUE ("group_id", "user_id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prayer_requests"
    ADD CONSTRAINT "prayer_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prayer_responses"
    ADD CONSTRAINT "prayer_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prayer_responses"
    ADD CONSTRAINT "prayer_responses_prayer_request_id_user_id_key" UNIQUE ("prayer_request_id", "user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_church_applications_email" ON "public"."church_applications" USING "btree" ("applicant_email");



CREATE INDEX "idx_church_applications_status" ON "public"."church_applications" USING "btree" ("status");



CREATE INDEX "idx_church_applications_submitted_at" ON "public"."church_applications" USING "btree" ("submitted_at" DESC);



CREATE INDEX "idx_church_applications_user_id" ON "public"."church_applications" USING "btree" ("applicant_user_id");



CREATE INDEX "idx_church_events_church_visibility" ON "public"."church_events" USING "btree" ("church_id", "visibility");



CREATE INDEX "idx_church_events_start_time" ON "public"."church_events" USING "btree" ("start_time");



CREATE INDEX "idx_church_groups_church_type" ON "public"."church_groups" USING "btree" ("church_id", "group_type");



CREATE INDEX "idx_church_invitations_church_status" ON "public"."church_invitations" USING "btree" ("church_id", "status");



CREATE INDEX "idx_church_invitations_email" ON "public"."church_invitations" USING "btree" ("email");



CREATE INDEX "idx_church_invitations_token" ON "public"."church_invitations" USING "btree" ("invitation_token");



CREATE INDEX "idx_church_posts_church_published" ON "public"."church_posts" USING "btree" ("church_id", "published", "visibility");



CREATE INDEX "idx_church_posts_slug" ON "public"."church_posts" USING "btree" ("church_id", "slug");



CREATE INDEX "idx_church_sermons_church_visibility" ON "public"."church_sermons" USING "btree" ("church_id", "visibility");



CREATE INDEX "idx_church_sermons_date" ON "public"."church_sermons" USING "btree" ("sermon_date" DESC);



CREATE INDEX "idx_group_members_group_role" ON "public"."group_members" USING "btree" ("group_id", "role");



CREATE INDEX "idx_prayer_requests_answered" ON "public"."prayer_requests" USING "btree" ("is_answered", "expires_at");



CREATE INDEX "idx_prayer_requests_church_privacy" ON "public"."prayer_requests" USING "btree" ("church_id", "privacy");



CREATE OR REPLACE TRIGGER "update_church_events_updated_at" BEFORE UPDATE ON "public"."church_events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_church_groups_updated_at" BEFORE UPDATE ON "public"."church_groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_church_posts_updated_at" BEFORE UPDATE ON "public"."church_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_church_sermons_updated_at" BEFORE UPDATE ON "public"."church_sermons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_prayer_requests_updated_at" BEFORE UPDATE ON "public"."prayer_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."church_applications"
    ADD CONSTRAINT "church_applications_applicant_user_id_fkey" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."church_applications"
    ADD CONSTRAINT "church_applications_created_admin_user_id_fkey" FOREIGN KEY ("created_admin_user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."church_applications"
    ADD CONSTRAINT "church_applications_created_church_id_fkey" FOREIGN KEY ("created_church_id") REFERENCES "public"."churches"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."church_applications"
    ADD CONSTRAINT "church_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."church_events"
    ADD CONSTRAINT "church_events_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_events"
    ADD CONSTRAINT "church_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_groups"
    ADD CONSTRAINT "church_groups_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_groups"
    ADD CONSTRAINT "church_groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_invitations"
    ADD CONSTRAINT "church_invitations_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_invitations"
    ADD CONSTRAINT "church_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_posts"
    ADD CONSTRAINT "church_posts_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_posts"
    ADD CONSTRAINT "church_posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_sermons"
    ADD CONSTRAINT "church_sermons_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."church_sermons"
    ADD CONSTRAINT "church_sermons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."church_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."church_groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prayer_requests"
    ADD CONSTRAINT "prayer_requests_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prayer_requests"
    ADD CONSTRAINT "prayer_requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prayer_responses"
    ADD CONSTRAINT "prayer_responses_prayer_request_id_fkey" FOREIGN KEY ("prayer_request_id") REFERENCES "public"."prayer_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prayer_responses"
    ADD CONSTRAINT "prayer_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage all prayers" ON "public"."prayer_requests" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "prayer_requests"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Admins can manage posts" ON "public"."church_posts" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_posts"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Admins can manage sermons" ON "public"."church_sermons" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_sermons"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Admins can view admin events" ON "public"."church_events" FOR SELECT USING ((("visibility" = 'ADMIN'::"public"."content_visibility") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_events"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"])))))));



CREATE POLICY "Allow authenticated users to read profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Church admins can manage events" ON "public"."church_events" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_events"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Church admins can manage groups" ON "public"."church_groups" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_groups"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Church admins can manage invitations" ON "public"."church_invitations" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_invitations"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Church admins can view all RSVPs" ON "public"."event_rsvps" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."profiles" "p"
     JOIN "public"."church_events" "e" ON (("e"."church_id" = "p"."church_id")))
  WHERE (("p"."id" = "auth"."uid"()) AND ("e"."id" = "event_rsvps"."event_id") AND ("p"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"]))))));



CREATE POLICY "Church members can manage prayer responses" ON "public"."prayer_responses" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Church members can manage their RSVPs" ON "public"."event_rsvps" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Church members can view groups" ON "public"."church_groups" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_groups"."church_id")))));



CREATE POLICY "Group leaders can manage their groups" ON "public"."group_members" USING ((EXISTS ( SELECT 1
   FROM "public"."group_members" "gm"
  WHERE (("gm"."group_id" = "group_members"."group_id") AND ("gm"."user_id" = "auth"."uid"()) AND ("gm"."role" = ANY (ARRAY['LEADER'::"text", 'ADMIN'::"text"]))))));



CREATE POLICY "Leadership can view leadership prayers" ON "public"."prayer_requests" FOR SELECT USING ((("privacy" = 'LEADERSHIP'::"public"."prayer_privacy") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "prayer_requests"."church_id") AND ("profiles"."role" = ANY (ARRAY['CHURCH_ADMIN'::"public"."user_role", 'SYSTEM_ADMIN'::"public"."user_role"])))))));



CREATE POLICY "Members can view member events" ON "public"."church_events" FOR SELECT USING ((("visibility" = 'MEMBERS'::"public"."content_visibility") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_events"."church_id"))))));



CREATE POLICY "Members can view member posts" ON "public"."church_posts" FOR SELECT USING ((("visibility" = 'MEMBERS'::"public"."content_visibility") AND ("published" = true) AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_posts"."church_id"))))));



CREATE POLICY "Members can view member sermons" ON "public"."church_sermons" FOR SELECT USING ((("visibility" = 'MEMBERS'::"public"."content_visibility") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "church_sermons"."church_id"))))));



CREATE POLICY "Members can view public prayers" ON "public"."prayer_requests" FOR SELECT USING ((("privacy" = 'PUBLIC'::"public"."prayer_privacy") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."church_id" = "prayer_requests"."church_id"))))));



CREATE POLICY "Public events visible to all" ON "public"."church_events" FOR SELECT USING (("visibility" = 'PUBLIC'::"public"."content_visibility"));



CREATE POLICY "Public posts visible to all" ON "public"."church_posts" FOR SELECT USING ((("visibility" = 'PUBLIC'::"public"."content_visibility") AND ("published" = true)));



CREATE POLICY "Public sermons visible to all" ON "public"."church_sermons" FOR SELECT USING (("visibility" = 'PUBLIC'::"public"."content_visibility"));



CREATE POLICY "System admins can view all applications" ON "public"."church_applications" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'SYSTEM_ADMIN'::"public"."user_role")))));



CREATE POLICY "Users can manage their group memberships" ON "public"."group_members" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own prayers" ON "public"."prayer_requests" USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can view their church" ON "public"."churches" FOR SELECT USING ((("id" IN ( SELECT "profiles"."church_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'SYSTEM_ADMIN'::"public"."user_role"))))));



CREATE POLICY "Users can view their own applications" ON "public"."church_applications" FOR SELECT USING ((("applicant_user_id" = "auth"."uid"()) OR ("applicant_email" = ( SELECT "profiles"."email"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))));



ALTER TABLE "public"."church_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."church_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."church_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."church_invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."church_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."church_sermons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."churches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_rsvps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."prayer_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."prayer_responses" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."approve_church_application"("p_application_id" "uuid", "p_approval_notes" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."approve_church_application"("p_application_id" "uuid", "p_approval_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."approve_church_application"("p_application_id" "uuid", "p_approval_notes" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_church_invitation"("p_church_id" "uuid", "p_email" "text", "p_role" "public"."user_role", "p_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_church_invitation"("p_church_id" "uuid", "p_email" "text", "p_role" "public"."user_role", "p_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_church_invitation"("p_church_id" "uuid", "p_email" "text", "p_role" "public"."user_role", "p_message" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_church_slug"("p_church_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_church_slug"("p_church_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_church_slug"("p_church_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_church_stats"("p_church_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_church_stats"("p_church_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_church_stats"("p_church_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_profile"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_profile"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_profile"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_invitation_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_invitation_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_invitation_signup"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."submit_church_application_existing_user"("p_church_name" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text", "p_applicant_title" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."submit_church_application_existing_user"("p_church_name" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text", "p_applicant_title" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_church_application_existing_user"("p_church_name" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text", "p_applicant_title" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."submit_church_application_new_user"("p_applicant_name" "text", "p_applicant_email" "text", "p_church_name" "text", "p_applicant_phone" "text", "p_applicant_title" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."submit_church_application_new_user"("p_applicant_name" "text", "p_applicant_email" "text", "p_church_name" "text", "p_applicant_phone" "text", "p_applicant_title" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_church_application_new_user"("p_applicant_name" "text", "p_applicant_email" "text", "p_church_name" "text", "p_applicant_phone" "text", "p_applicant_title" "text", "p_church_denomination" "text", "p_church_address" "text", "p_church_city" "text", "p_church_state" "text", "p_church_zip" "text", "p_church_phone" "text", "p_church_email" "text", "p_church_website" "text", "p_church_founded_year" integer, "p_estimated_congregation_size" integer, "p_current_church_software" "text", "p_leadership_position" "text", "p_years_in_position" integer, "p_leadership_verification_method" "text", "p_motivation" "text", "p_current_challenges" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") TO "service_role";


















GRANT ALL ON TABLE "public"."church_applications" TO "anon";
GRANT ALL ON TABLE "public"."church_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."church_applications" TO "service_role";



GRANT ALL ON TABLE "public"."church_events" TO "anon";
GRANT ALL ON TABLE "public"."church_events" TO "authenticated";
GRANT ALL ON TABLE "public"."church_events" TO "service_role";



GRANT ALL ON TABLE "public"."church_groups" TO "anon";
GRANT ALL ON TABLE "public"."church_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."church_groups" TO "service_role";



GRANT ALL ON TABLE "public"."church_invitations" TO "anon";
GRANT ALL ON TABLE "public"."church_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."church_invitations" TO "service_role";



GRANT ALL ON TABLE "public"."church_posts" TO "anon";
GRANT ALL ON TABLE "public"."church_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."church_posts" TO "service_role";



GRANT ALL ON TABLE "public"."church_sermons" TO "anon";
GRANT ALL ON TABLE "public"."church_sermons" TO "authenticated";
GRANT ALL ON TABLE "public"."church_sermons" TO "service_role";



GRANT ALL ON TABLE "public"."churches" TO "anon";
GRANT ALL ON TABLE "public"."churches" TO "authenticated";
GRANT ALL ON TABLE "public"."churches" TO "service_role";



GRANT ALL ON TABLE "public"."event_rsvps" TO "anon";
GRANT ALL ON TABLE "public"."event_rsvps" TO "authenticated";
GRANT ALL ON TABLE "public"."event_rsvps" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON TABLE "public"."prayer_requests" TO "anon";
GRANT ALL ON TABLE "public"."prayer_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."prayer_requests" TO "service_role";



GRANT ALL ON TABLE "public"."prayer_responses" TO "anon";
GRANT ALL ON TABLE "public"."prayer_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."prayer_responses" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
