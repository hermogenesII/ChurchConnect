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
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <RegistrationForm
        title="Join Our Community"
        subtitle="Create your account to connect with your church family"
        submitButtonText="Create Account"
        showLoginLink={true}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}