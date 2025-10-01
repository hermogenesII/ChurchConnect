/**
 * Supabase Client Configuration
 *
 * This file sets up the Supabase client for browser/client-side usage.
 * For server-side usage (middleware, server components), create a separate
 * server client using createServerClient from '@supabase/ssr'
 */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser Supabase client instance
 *
 * This client automatically handles:
 * - Cookie-based authentication
 * - Session management
 * - Real-time subscriptions
 *
 * Use this in client components (marked with 'use client')
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Re-export database types for convenience
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Church = Database['public']['Tables']['churches']['Row']
export type UserRole = Database['public']['Enums']['user_role']