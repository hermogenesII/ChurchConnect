'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChurchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      
      if (!isAdmin()) {
        router.push('/member') // Redirect members to member dashboard
        return
      }
    }
  }, [user, profile, loading, isAdmin, router])

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

  if (!user || !isAdmin()) {
    return null // Redirect is handling navigation
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-display font-bold text-primary-900">
              Church Portal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavItem href="/church" icon="🏠" label="Dashboard" />
            
            {/* Church Management */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Church Management
              </p>
              <NavItem href="/church/members" icon="👥" label="Members" />
              <NavItem href="/church/events" icon="📅" label="Events" />
              <NavItem href="/church/announcements" icon="📢" label="Announcements" />
            </div>

            {/* Resources */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Resources
              </p>
              <NavItem href="/church/files" icon="📁" label="Files & Documents" />
              <NavItem href="/church/inventory" icon="📦" label="Inventory" />
              <NavItem href="/church/information" icon="🏛️" label="Church Info" />
            </div>

            {/* Analytics */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Reports
              </p>
              <NavItem href="/church/analytics" icon="📊" label="Analytics" />
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.role?.toLowerCase().replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: string
  label: string
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <a
      href={href}
      className="group flex items-center px-3 py-2 text-sm font-medium rounded-xl text-gray-700 hover:text-primary-900 hover:bg-primary-50 transition-colors"
    >
      <span className="mr-3 text-lg" role="img" aria-hidden="true">
        {icon}
      </span>
      {label}
    </a>
  )
}