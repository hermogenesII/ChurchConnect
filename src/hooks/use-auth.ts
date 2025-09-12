'use client'

import { useState, useEffect } from 'react'
import { supabase, type Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true
  })

  useEffect(() => {
    let mounted = true
    let currentUserId: string | null = null

    // Fetch user profile (with duplicate prevention)
    const fetchProfile = async (user: User) => {
      // Prevent duplicate fetches for the same user
      if (currentUserId === user.id || !mounted) return
      currentUserId = user.id

      try {
        console.log('Fetching profile for user:', user.email, user.id)
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!mounted) return // Component unmounted

        if (error) {
          console.error('Profile fetch error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          
          // Check if it's a "relation does not exist" error (table not created yet)
          if (error.message?.includes('relation') || error.code === 'PGRST116') {
            console.warn('Database tables not set up yet. Please run the database-setup.sql script in Supabase.')
          } else if (error.code === 'PGRST116') {
            console.warn('No profile found for user. Creating profile may be needed.')
          } else {
            console.error('Error fetching profile:', error)
          }
          setAuthState({ user, profile: null, loading: false })
        } else {
          console.log('Profile fetched successfully:', profile)
          setAuthState({ user, profile, loading: false })
        }
      } catch (error) {
        if (!mounted) return
        console.error('Profile fetch exception:', error)
        setAuthState({ user, profile: null, loading: false })
      }
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        if (mounted) {
          setAuthState({ user: null, profile: null, loading: false })
        }
      }
    }

    // Listen for auth changes (this handles changes after initial load)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchProfile(session.user)
        } else {
          currentUserId = null
          if (mounted) {
            setAuthState({ user: null, profile: null, loading: false })
          }
        }
      }
    )

    // Get initial session
    getInitialSession()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
      console.log('Sign in successful:', data.user?.email)
      return { error: null }
    } catch (err) {
      console.error('Sign in exception:', err)
      return { error: err as Error }
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: string = 'MEMBER',
    churchId?: string
  ) => {
    try {
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            church_id: churchId
          }
        }
      })

      if (error) return { data, error }

      // If successful and we have a user, update the profile with church_id
      if (data.user && churchId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ church_id: churchId })
          .eq('id', data.user.id)

        if (profileError) {
          console.error('Error updating profile with church_id:', profileError)
        }
      }

      return { data, error }
    } catch (err) {
      console.error('SignUp error:', err)
      return { data: null, error: err as Error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Helper functions
  const isAdmin = () => {
    return authState.profile?.role === 'CHURCH_ADMIN' || authState.profile?.role === 'SYSTEM_ADMIN'
  }

  const isSystemAdmin = () => {
    return authState.profile?.role === 'SYSTEM_ADMIN'
  }

  const isMember = () => {
    return authState.profile?.role === 'MEMBER'
  }

  return {
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSystemAdmin,
    isMember
  }
}