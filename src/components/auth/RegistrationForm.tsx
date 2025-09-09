'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { UserRole } from '@/lib/supabase'

interface RegistrationFormProps {
  // Optional: Admin can set these for new member registration
  defaultRole?: UserRole
  defaultChurchId?: string
  showRoleSelector?: boolean
  showChurchSelector?: boolean
  onSuccess?: (userId: string) => void
  onError?: (error: string) => void
  // UI customization
  title?: string
  subtitle?: string
  submitButtonText?: string
  showLoginLink?: boolean
}

export function RegistrationForm({
  defaultRole = 'MEMBER',
  defaultChurchId,
  showRoleSelector = false,
  showChurchSelector = false,
  onSuccess,
  onError,
  title = 'Create Account',
  subtitle = 'Join our church community',
  submitButtonText = 'Create Account',
  showLoginLink = true,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    churchId: defaultChurchId || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await signUp(
      formData.email, 
      formData.password, 
      formData.name,
      formData.role
    )
    
    if (signUpError) {
      setError(signUpError.message)
      onError?.(signUpError.message)
    } else if (data.user) {
      onSuccess?.(data.user.id)
      // Success handled by parent component or redirect
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
          {title}
        </h1>
        <p className="text-neutral-600">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Role Selector (Admin only) */}
        {showRoleSelector && (
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-neutral-900"
            >
              <option value="MEMBER">Member</option>
              <option value="CHURCH_ADMIN">Church Admin</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
          </div>
        )}

        {/* Church Selector (System Admin only) */}
        {showChurchSelector && (
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Church
            </label>
            <select
              name="churchId"
              value={formData.churchId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-neutral-900"
            >
              <option value="">Select Church</option>
              {/* TODO: Load churches from database */}
              <option value="church-1">First Baptist Church</option>
              <option value="church-2">Grace Community Church</option>
            </select>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
            placeholder="Create a secure password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
            placeholder="Confirm your password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          {loading ? 'Creating Account...' : submitButtonText}
        </button>
      </form>

      {/* Login Link */}
      {showLoginLink && (
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <a 
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign In
            </a>
          </p>
        </div>
      )}
    </div>
  )
}