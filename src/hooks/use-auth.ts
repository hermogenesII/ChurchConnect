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
          // Handle database setup issues gracefully
          const isEmptyError = !error.code && !error.message && Object.keys(error).length === 0
          const isTableMissing = error.message?.includes('relation') || error.code === 'PGRST116' || isEmptyError

          if (isTableMissing) {
            // Only show this warning once per session
            if (!sessionStorage.getItem('database-warning-shown')) {
              console.warn('⚠️ Database tables not found. Please run the supabase-dump.sql script in your Supabase SQL Editor.')
              sessionStorage.setItem('database-warning-shown', 'true')
            }
          } else {
            // Only log real errors in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Profile fetch error:', {
                code: error.code,
                message: error.message,
                details: error.details
              })
            }
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
        // Only log detailed errors in development, not user-friendly auth failures
        if (process.env.NODE_ENV === 'development' && error.message !== 'Invalid login credentials') {
          console.error('Sign in error:', error)
        }

        // Convert Supabase auth errors to user-friendly messages
        let userFriendlyMessage = error.message

        if (error.message === 'Invalid login credentials') {
          userFriendlyMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.'
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Please check your email and click the confirmation link before signing in.'
        } else if (error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Too many login attempts. Please wait a moment and try again.'
        } else if (error.message.includes('User not found')) {
          userFriendlyMessage = 'No account found with this email address. Please check your email or create a new account.'
        } else if (error.message.includes('network')) {
          userFriendlyMessage = 'Network error. Please check your internet connection and try again.'
        }

        return { error: { ...error, message: userFriendlyMessage } }
      }

      console.log('Sign in successful:', data.user?.email)
      return { error: null }
    } catch (err) {
      console.error('Sign in exception:', err)
      const friendlyError = {
        message: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
      }
      return { error: friendlyError as Error }
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