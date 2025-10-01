'use client'

import Link from 'next/link'
import { useMobile } from '@/hooks'

export function ChurchCTA() {
  const isMobile = useMobile()

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-spiritual-600 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center ${isMobile ? 'px-4' : ''}`}>
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm
                        rounded-full px-4 py-2 mb-6">
            <span className="text-2xl">⛪</span>
            <span className="text-white font-medium text-sm">
              Join 500+ Churches
            </span>
          </div>

          {/* Heading */}
          <h2 className={`font-bold text-white mb-6 ${
            isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'
          }`}>
            Ready to Transform Your Church Community?
          </h2>

          {/* Description */}
          <p className={`text-white/90 mb-8 max-w-2xl mx-auto ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            Start your free journey today. No credit card required.
            Our team will review your application within 2-3 business days.
          </p>

          {/* CTA Buttons */}
          <div className={`flex gap-4 justify-center ${
            isMobile ? 'flex-col items-stretch' : 'flex-row items-center'
          }`}>
            <Link
              href="/apply-church"
              className={`bg-white text-primary-600 font-semibold rounded-lg
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                       transition-all duration-200 ${
                         isMobile
                           ? 'px-6 py-4 text-base'
                           : 'px-8 py-4 text-lg'
                       }`}
            >
              Register Your Church
              <span className="ml-2">→</span>
            </Link>

            <Link
              href="/demo"
              className={`bg-white/10 backdrop-blur-sm text-white font-semibold
                       rounded-lg border-2 border-white/30
                       hover:bg-white/20 transition-all duration-200 ${
                         isMobile
                           ? 'px-6 py-4 text-base'
                           : 'px-8 py-4 text-lg'
                       }`}
            >
              Watch Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={`mt-10 pt-8 border-t border-white/20 ${
            isMobile ? 'space-y-4' : 'flex items-center justify-center space-x-8'
          }`}>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">✓</span>
              <span className="text-sm">Free to use</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">✓</span>
              <span className="text-sm">Quick approval</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">✓</span>
              <span className="text-sm">Full support included</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span className="text-xl">✓</span>
              <span className="text-sm">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
