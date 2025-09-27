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
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
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
      formData.role,
      formData.churchId || defaultChurchId
    )
    
    if (signUpError) {
      setError(signUpError.message)
      onError?.(signUpError.message)
    } else if (data.user) {
      // Show success animation
      setSuccess(true)
      setError('')

      // Call success callback after animation
      setTimeout(() => {
        if (data.user) {
          onSuccess?.(data.user.id)
        }
      }, 1500)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md w-full bg-neutral-50/95 rounded-2xl shadow-xl border border-neutral-200/50 backdrop-blur-sm p-8">
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
              placeholder="Create a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-500 text-neutral-900"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
            <div
              className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center"
              style={{ animation: "successBounce 0.6s ease-out" }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  strokeDasharray: "20",
                  animation: "checkmarkDraw 0.8s ease-out 0.2s forwards",
                  strokeDashoffset: "20"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-success-700 text-sm">Account Created Successfully! 🎉</p>
              <p className="text-sm text-success-600">Welcome to your church community</p>
            </div>
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