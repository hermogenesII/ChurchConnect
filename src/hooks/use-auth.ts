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
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        setAuthState({ user: null, profile: null, loading: false })
      }
    }

    // Fetch user profile
    const fetchProfile = async (user: User) => {
      try {
        console.log('Fetching profile for user:', user.email, user.id)
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

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
        console.error('Profile fetch exception:', error)
        setAuthState({ user, profile: null, loading: false })
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfile(session.user)
        } else {
          setAuthState({ user: null, profile: null, loading: false })
        }
      }
    )

    getInitialSession()

    return () => subscription.unsubscribe()
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

  const signUp = async (email: string, password: string, name: string, role: string = 'MEMBER') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })
    return { data, error }
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