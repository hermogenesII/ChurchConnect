'use client'

import { useRouter } from 'next/navigation'

interface ProfileSetupErrorProps {
  onSignOut: () => Promise<{ error: Error | null }>
}

export function ProfileSetupError({ onSignOut }: ProfileSetupErrorProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await onSignOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">
          Profile Setup Required
        </h2>

        {/* Description */}
        <p className="text-neutral-600 mb-6">
          Your account exists but your profile hasn&apos;t been set up yet.
          This usually means:
        </p>

        {/* Reasons List */}
        <ul className="text-left text-sm text-neutral-600 space-y-2 mb-6">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">•</span>
            <span>The database tables haven&apos;t been created yet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">•</span>
            <span>Your profile needs to be created by an administrator</span>
          </li>
        </ul>

        {/* Developer Instructions */}
        <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-600 mb-6">
          <p className="font-semibold mb-2">For Developers:</p>
          <p className="text-xs">
            Run the{' '}
            <code className="bg-neutral-200 px-1 rounded">
              supabase-dump.sql
            </code>{' '}
            script in your Supabase SQL Editor to create the required tables.
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
