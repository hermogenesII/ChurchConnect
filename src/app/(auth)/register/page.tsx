'use client'

import { useRouter } from 'next/navigation'
import { RegistrationForm } from '@/components/auth/RegistrationForm'

export default function RegisterPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect to login with success message
    router.push('/login?message=Account created! Please sign in.')
  }

  const handleError = (error: string) => {
    console.error('Registration error:', error)
    // Error is handled by the form component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      {/* Back Button - Top Left */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      <div className="max-w-md w-full">
        <RegistrationForm
          title="Join Our Community"
          subtitle="Create your account to connect with your church family"
          submitButtonText="Create Account"
          showLoginLink={true}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  )
}