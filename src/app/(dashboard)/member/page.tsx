'use client'

import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function MemberDashboard() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-display font-bold text-primary-900">
            Welcome, {profile?.name || 'Member'}!
          </h1>
          <p className="text-neutral-600 mt-2">
            Stay connected with your church community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickLink
            href="/member/events"
            icon="📅"
            title="Events"
            description="View upcoming church events"
            color="blue"
          />
          <QuickLink
            href="/member/prayers"
            icon="🙏"
            title="Prayer Requests"
            description="Share and support prayers"
            color="purple"
          />
          <QuickLink
            href="/member/directory"
            icon="👥"
            title="Directory"
            description="Connect with members"
            color="green"
          />
          <QuickLink
            href="/member/giving"
            icon="💝"
            title="Giving"
            description="Support the ministry"
            color="yellow"
          />
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary-900">Upcoming Events</h2>
            <Link href="/member/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-neutral-600">No upcoming events</p>
            <p className="text-sm text-neutral-500 mt-1">Check back later for new events</p>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary-900">Recent Announcements</h2>
            <Link href="/member/announcements" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📢</div>
            <p className="text-neutral-600">No recent announcements</p>
            <p className="text-sm text-neutral-500 mt-1">Stay tuned for updates from your church</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuickLinkProps {
  href: string
  icon: string
  title: string
  description: string
  color: 'blue' | 'purple' | 'green' | 'yellow'
}

function QuickLink({ href, icon, title, description, color }: QuickLinkProps) {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    green: 'bg-green-50 hover:bg-green-100 border-green-200',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
  }

  return (
    <Link
      href={href}
      className={`${colorClasses[color]} border-2 rounded-2xl p-6 transition-all hover:shadow-md`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-primary-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
    </Link>
  )
}
