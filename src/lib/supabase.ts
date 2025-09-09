import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Re-export types from generated database types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Church = Database['public']['Tables']['churches']['Row']
export type UserRole = Database['public']['Enums']['user_role']