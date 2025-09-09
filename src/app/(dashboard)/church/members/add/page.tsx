'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegistrationForm } from '@/components/auth/RegistrationForm'
import { useAuth } from '@/hooks/use-auth'

export default function AddMemberPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [successMessage, setSuccessMessage] = useState('')

  const handleSuccess = (userId: string) => {
    setSuccessMessage(`New member account created successfully! User ID: ${userId}`)
    // Could also refresh member list or navigate back
    setTimeout(() => {
      router.push('/church/members')
    }, 2000)
  }

  const handleError = (error: string) => {
    console.error('Member registration error:', error)
  }

  if (successMessage) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-success-50 border border-success-200 text-success-600 px-6 py-4 rounded-xl text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="font-semibold">{successMessage}</p>
            <p className="text-sm mt-2">Redirecting to members list...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-neutral-600 hover:text-primary-600 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-display font-bold text-primary-900">
            Add New Member
          </h1>
        </div>
        <p className="text-neutral-600 mt-2">
          Create a new member account for your church community
        </p>
      </div>

      {/* Registration Form */}
      <div className="flex justify-center">
        <RegistrationForm
          title="New Member Registration"
          subtitle="Fill out the form below to create a new member account"
          submitButtonText="Create Member Account"
          showLoginLink={false}
          defaultRole="MEMBER"
          defaultChurchId={profile?.church_id || undefined}
          showRoleSelector={profile?.role === 'SYSTEM_ADMIN'} // Only system admin can change roles
          showChurchSelector={profile?.role === 'SYSTEM_ADMIN'} // Only system admin can select church
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  )
}