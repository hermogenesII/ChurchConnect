export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      church_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          applicant_title: string | null
          applicant_user_id: string | null
          application_type: string
          approval_notes: string | null
          church_address: string | null
          church_city: string | null
          church_denomination: string | null
          church_email: string | null
          church_founded_year: number | null
          church_name: string
          church_phone: string | null
          church_state: string | null
          church_website: string | null
          church_zip: string | null
          created_admin_user_id: string | null
          created_at: string | null
          created_church_id: string | null
          current_challenges: string | null
          current_church_software: string | null
          estimated_congregation_size: number | null
          id: string
          leadership_position: string
          leadership_verification_method: string | null
          motivation: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          submitted_at: string | null
          updated_at: string | null
          years_in_position: number | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          applicant_title?: string | null
          applicant_user_id?: string | null
          application_type: string
          approval_notes?: string | null
          church_address?: string | null
          church_city?: string | null
          church_denomination?: string | null
          church_email?: string | null
          church_founded_year?: number | null
          church_name: string
          church_phone?: string | null
          church_state?: string | null
          church_website?: string | null
          church_zip?: string | null
          created_admin_user_id?: string | null
          created_at?: string | null
          created_church_id?: string | null
          current_challenges?: string | null
          current_church_software?: string | null
          estimated_congregation_size?: number | null
          id?: string
          leadership_position: string
          leadership_verification_method?: string | null
          motivation?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          years_in_position?: number | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          applicant_title?: string | null
          applicant_user_id?: string | null
          application_type?: string
          approval_notes?: string | null
          church_address?: string | null
          church_city?: string | null
          church_denomination?: string | null
          church_email?: string | null
          church_founded_year?: number | null
          church_name?: string
          church_phone?: string | null
          church_state?: string | null
          church_website?: string | null
          church_zip?: string | null
          created_admin_user_id?: string | null
          created_at?: string | null
          created_church_id?: string | null
          current_challenges?: string | null
          current_church_software?: string | null
          estimated_congregation_size?: number | null
          id?: string
          leadership_position?: string
          leadership_verification_method?: string | null
          motivation?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          years_in_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "church_applications_applicant_user_id_fkey"
            columns: ["applicant_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_applications_created_admin_user_id_fkey"
            columns: ["created_admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_applications_created_church_id_fkey"
            columns: ["created_church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      church_events: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          external_link: string | null
          id: string
          image_url: string | null
          location: string | null
          max_attendees: number | null
          requires_rsvp: boolean | null
          start_time: string
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["content_visibility"] | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          requires_rsvp?: boolean | null
          start_time: string
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["content_visibility"] | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          requires_rsvp?: boolean | null
          start_time?: string
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["content_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "church_events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      church_groups: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string
          description: string | null
          group_type: string | null
          id: string
          image_url: string | null
          is_open: boolean | null
          max_members: number | null
          meeting_day: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          group_type?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          group_type?: string | null
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_groups_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      church_invitations: {
        Row: {
          accepted_at: string | null
          church_id: string
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invitation_token: string | null
          invited_by: string
          message: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["invitation_status"] | null
        }
        Insert: {
          accepted_at?: string | null
          church_id: string
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_by: string
          message?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
        }
        Update: {
          accepted_at?: string | null
          church_id?: string
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_by?: string
          message?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "church_invitations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      church_posts: {
        Row: {
          church_id: string
          content: string
          created_at: string | null
          created_by: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
          visibility: Database["public"]["Enums"]["content_visibility"] | null
        }
        Insert: {
          church_id: string
          content: string
          created_at?: string | null
          created_by: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["content_visibility"] | null
        }
        Update: {
          church_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["content_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "church_posts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      church_sermons: {
        Row: {
          audio_url: string | null
          church_id: string
          created_at: string | null
          created_by: string
          description: string | null
          duration_minutes: number | null
          featured: boolean | null
          id: string
          notes_url: string | null
          scripture_reference: string | null
          series_name: string | null
          sermon_date: string
          speaker: string
          title: string
          transcript: string | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
          visibility: Database["public"]["Enums"]["content_visibility"] | null
        }
        Insert: {
          audio_url?: string | null
          church_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          notes_url?: string | null
          scripture_reference?: string | null
          series_name?: string | null
          sermon_date: string
          speaker: string
          title: string
          transcript?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["content_visibility"] | null
        }
        Update: {
          audio_url?: string | null
          church_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          notes_url?: string | null
          scripture_reference?: string | null
          series_name?: string | null
          sermon_date?: string
          speaker?: string
          title?: string
          transcript?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["content_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "church_sermons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_sermons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          guests_count: number | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          guests_count?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          guests_count?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "church_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "church_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          answer_note: string | null
          answered_at: string | null
          church_id: string
          created_at: string | null
          created_by: string
          description: string
          expires_at: string | null
          id: string
          is_answered: boolean | null
          privacy: Database["public"]["Enums"]["prayer_privacy"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          answer_note?: string | null
          answered_at?: string | null
          church_id: string
          created_at?: string | null
          created_by: string
          description: string
          expires_at?: string | null
          id?: string
          is_answered?: boolean | null
          privacy?: Database["public"]["Enums"]["prayer_privacy"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          answer_note?: string | null
          answered_at?: string | null
          church_id?: string
          created_at?: string | null
          created_by?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_answered?: boolean | null
          privacy?: Database["public"]["Enums"]["prayer_privacy"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_responses: {
        Row: {
          created_at: string | null
          encouragement_note: string | null
          id: string
          is_praying: boolean | null
          prayer_request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          encouragement_note?: string | null
          id?: string
          is_praying?: boolean | null
          prayer_request_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          encouragement_note?: string | null
          id?: string
          is_praying?: boolean | null
          prayer_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_responses_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          church_id: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          church_id?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          church_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_church_application: {
        Args: { p_application_id: string; p_approval_notes?: string }
        Returns: Json
      }
      create_church_invitation: {
        Args: {
          p_church_id: string
          p_email: string
          p_message?: string
          p_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: string
      }
      generate_church_slug: {
        Args: { p_church_name: string }
        Returns: string
      }
      get_church_stats: {
        Args: { p_church_id: string }
        Returns: Json
      }
      get_user_profile: {
        Args: { user_id?: string }
        Returns: {
          avatar_url: string
          church_id: string
          church_name: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      submit_church_application_existing_user: {
        Args: {
          p_applicant_title?: string
          p_church_address?: string
          p_church_city?: string
          p_church_denomination?: string
          p_church_email?: string
          p_church_founded_year?: number
          p_church_name: string
          p_church_phone?: string
          p_church_state?: string
          p_church_website?: string
          p_church_zip?: string
          p_current_challenges?: string
          p_current_church_software?: string
          p_estimated_congregation_size?: number
          p_leadership_position?: string
          p_leadership_verification_method?: string
          p_motivation?: string
          p_years_in_position?: number
        }
        Returns: Json
      }
      submit_church_application_new_user: {
        Args: {
          p_applicant_email: string
          p_applicant_name: string
          p_applicant_phone?: string
          p_applicant_title?: string
          p_church_address?: string
          p_church_city?: string
          p_church_denomination?: string
          p_church_email?: string
          p_church_founded_year?: number
          p_church_name: string
          p_church_phone?: string
          p_church_state?: string
          p_church_website?: string
          p_church_zip?: string
          p_current_challenges?: string
          p_current_church_software?: string
          p_estimated_congregation_size?: number
          p_leadership_position?: string
          p_leadership_verification_method?: string
          p_motivation?: string
          p_years_in_position?: number
        }
        Returns: Json
      }
      update_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      application_status:
        | "PENDING"
        | "UNDER_REVIEW"
        | "APPROVED"
        | "REJECTED"
        | "ADDITIONAL_INFO_NEEDED"
      content_visibility: "PUBLIC" | "MEMBERS" | "ADMIN"
      event_type:
        | "SERVICE"
        | "BIBLE_STUDY"
        | "FELLOWSHIP"
        | "OUTREACH"
        | "MEETING"
        | "SPECIAL"
        | "OTHER"
      invitation_status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED"
      prayer_privacy: "PUBLIC" | "LEADERSHIP" | "PRIVATE"
      user_role: "MEMBER" | "CHURCH_ADMIN" | "SYSTEM_ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "PENDING",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "ADDITIONAL_INFO_NEEDED",
      ],
      content_visibility: ["PUBLIC", "MEMBERS", "ADMIN"],
      event_type: [
        "SERVICE",
        "BIBLE_STUDY",
        "FELLOWSHIP",
        "OUTREACH",
        "MEETING",
        "SPECIAL",
        "OTHER",
      ],
      invitation_status: ["PENDING", "ACCEPTED", "EXPIRED", "CANCELLED"],
      prayer_privacy: ["PUBLIC", "LEADERSHIP", "PRIVATE"],
      user_role: ["MEMBER", "CHURCH_ADMIN", "SYSTEM_ADMIN"],
    },
  },
} as const
