'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export function Hero() {
  const { user, profile, loading } = useAuth()

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat overflow-hidden min-h-screen flex items-center"
      style={{
        backgroundImage: "url('/images/background/church.avif')",
      }}
      aria-label="Hero section"
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Gradient overlay for warmth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-secondary-900/20" aria-hidden="true" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            {user ? (
              <>
                Welcome Back,
                <span className="block text-secondary-300">{profile?.name || 'Friend'}!</span>
              </>
            ) : (
              <>
                Connect with Your
                <span className="block text-secondary-300">Church Community</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-gray-200 max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed px-4 lg:px-0">
            {user
              ? "Continue your journey of faith with your church community."
              : "Stay connected with your church family, participate in events, share prayer requests, and grow together in faith."
            }
          </p>

          {/* CTA buttons */}
          {!loading && (
            <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-center px-6 md:px-0">
              {user ? (
                <>
                  <Link
                    href={profile?.role === 'CHURCH_ADMIN' || profile?.role === 'SYSTEM_ADMIN' ? '/church' : '/member'}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full md:w-auto py-4 md:py-3 px-8 text-lg md:text-base text-center inline-block"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/church/events"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto py-4 md:py-3 px-8 text-lg md:text-base text-center inline-block"
                  >
                    View Events
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full md:w-auto py-4 md:py-3 px-8 text-lg md:text-base text-center inline-block"
                  >
                    Join Our Community
                  </Link>

                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto py-4 md:py-3 px-8 text-lg md:text-base text-center inline-block"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Trust indicator */}
          <p className="mt-8 text-sm text-gray-300">
            Trusted by{" "}
            <span className="font-semibold text-secondary-300">500+</span>{" "}
            churches worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
