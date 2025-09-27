'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function ChurchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

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

  // Keyboard support and modal animation
  useEffect(() => {
    if (showSignOutConfirm) {
      // Add entrance animation delay
      setTimeout(() => setModalVisible(true), 10)

      // Focus on cancel button for accessibility
      setTimeout(() => cancelButtonRef.current?.focus(), 100)

      // ESC key to close modal
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseModal()
        }
      }

      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    } else {
      setModalVisible(false)
    }
  }, [showSignOutConfirm])

  const handleCloseModal = () => {
    setModalVisible(false)
    setTimeout(() => setShowSignOutConfirm(false), 200) // Allow exit animation
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

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

          {/* User Profile Dropdown */}
          <div className="p-4 border-t border-gray-200 relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.role?.toLowerCase().replace('_', ' ')}</p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    setShowSignOutConfirm(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-error-600 hover:bg-error-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${modalVisible ? 'backdrop-blur-md bg-white/30' : 'backdrop-blur-0 bg-transparent'}`}>
          {/* Background overlay */}
          <div
            className="absolute inset-0"
            onClick={handleCloseModal}
          ></div>

          {/* Modal */}
          <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-md w-full mx-auto transform transition-all duration-300 ${modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="p-6">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-100 mb-4">
                <svg className="h-6 w-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  Sign Out Confirmation
                </h3>
                <p className="text-neutral-600 mb-6">
                  Are you sure you want to sign out? Any unsaved changes will be lost.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  ref={cancelButtonRef}
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    handleCloseModal();
                    await signOut();
                    window.location.href = '/login';
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-error-600 hover:bg-error-700 rounded-lg transition-colors focus:ring-2 focus:ring-error-300 focus:outline-none"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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