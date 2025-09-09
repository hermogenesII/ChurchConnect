'use client'

import { useRouter } from 'next/navigation'
import { RegistrationForm } from '@/components/auth/RegistrationForm'

export default function AdminRegisterPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/login?message=Church admin account created! Please sign in.')
  }

  const handleError = (error: string) => {
    console.error('Admin registration error:', error)
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <RegistrationForm
        title="Create Church Admin Account"
        subtitle="Register as a church administrator"
        submitButtonText="Create Admin Account"
        showLoginLink={true}
        defaultRole="CHURCH_ADMIN"
        showRoleSelector={false} // Church admin is set by default
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}