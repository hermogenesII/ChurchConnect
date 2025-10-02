'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'

export interface DashboardStats {
  totalMembers: number
  upcomingEvents: number
  prayerRequests: number
  weeklyAttendance: string
}

/**
 * Hook to fetch dashboard statistics
 * Returns real-time stats from Supabase
 */
export function useDashboardStats() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    upcomingEvents: 0,
    prayerRequests: 0,
    weeklyAttendance: '0%'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.church_id) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      try {
        // Fetch total members count
        const { count: membersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('church_id', profile.church_id)

        // TODO: Fetch upcoming events count (when events table is created)
        // const { count: eventsCount } = await supabase
        //   .from('events')
        //   .select('*', { count: 'exact', head: true })
        //   .eq('church_id', profile.church_id)
        //   .gte('start_date', new Date().toISOString())

        // TODO: Fetch prayer requests count (when prayer_requests table is created)
        // const { count: prayersCount } = await supabase
        //   .from('prayer_requests')
        //   .select('*', { count: 'exact', head: true })
        //   .eq('church_id', profile.church_id)
        //   .eq('status', 'active')

        setStats({
          totalMembers: membersCount || 0,
          upcomingEvents: 0, // Will be implemented when events table exists
          prayerRequests: 0, // Will be implemented when prayer_requests table exists
          weeklyAttendance: '0%' // Will be calculated from attendance data
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [profile?.church_id])

  return { stats, loading }
}
