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
    let fetchingProfile = false

    // Fetch user profile with timeout
    const fetchProfile = async (user: User) => {
      // Prevent concurrent fetches
      if (fetchingProfile || !mounted) return
      fetchingProfile = true

      try {
        // Fetch profile with 2 second timeout
        const { data: profile, error } = await Promise.race([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          new Promise<{ data: null; error: Error }>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 2000)
          )
        ]).catch(() => ({ data: null, error: { message: 'timeout' } }))

        if (!mounted) return

        // If error (including timeout), just set user without profile
        if (error || !profile) {
          if (error?.message && !error.message.includes('timeout')) {
            // Show database warning once
            if (!sessionStorage.getItem('db-warning')) {
              console.warn('⚠️ Database not set up. Run supabase-dump.sql in Supabase SQL Editor.')
              sessionStorage.setItem('db-warning', '1')
            }
          }
          setAuthState({ user, profile: null, loading: false })
        } else {
          setAuthState({ user, profile, loading: false })
        }
      } catch (error) {
        if (!mounted) return
        setAuthState({ user, profile: null, loading: false })
      } finally {
        fetchingProfile = false
      }
    }

    // Listen for auth changes (handles both initial and subsequent changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchProfile(session.user)
        } else {
          if (mounted) {
            setAuthState({ user: null, profile: null, loading: false })
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
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

      return { error: null }
    } catch (err) {
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
        await supabase
          .from('profiles')
          .update({ church_id: churchId })
          .eq('id', data.user.id)
      }

      return { data, error }
    } catch (err) {
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