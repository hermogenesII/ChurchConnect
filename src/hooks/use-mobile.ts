'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to detect if the current device is mobile
 * Uses window.matchMedia to detect screen size and touch capability
 * 
 * @returns {boolean} true if device is mobile, false otherwise
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      // Check for mobile screen size (less than lg breakpoint: 1024px)
      const hasSmallScreen = window.matchMedia('(max-width: 1023px)').matches
      
      // Check for touch capability
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Consider mobile if screen is small OR device has touch capability
      setIsMobile(hasSmallScreen || hasTouchScreen)
    }

    // Initial check
    checkIsMobile()

    // Create media query listener for screen size changes
    const mediaQuery = window.matchMedia('(max-width: 1023px)')
    
    // Use addEventListener (modern browsers support this)
    mediaQuery.addEventListener('change', checkIsMobile)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', checkIsMobile)
    }
  }, [])

  return isMobile
}

/**
 * Server-side safe version that returns false during SSR
 * Use this when you need the hook to work during server-side rendering
 * 
 * @returns {boolean} false during SSR, actual mobile detection on client
 */
export function useMobileSSR(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkIsMobile = () => {
      const hasSmallScreen = window.matchMedia('(max-width: 1023px)').matches
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(hasSmallScreen || hasTouchScreen)
    }

    checkIsMobile()

    const mediaQuery = window.matchMedia('(max-width: 1023px)')
    
    mediaQuery.addEventListener('change', checkIsMobile)

    return () => {
      mediaQuery.removeEventListener('change', checkIsMobile)
    }
  }, [])

  // Return false during SSR to prevent hydration mismatch
  if (!mounted) return false
  
  return isMobile
}

/**
 * Utility function to detect mobile on server-side (headers-based)
 * Use in server components or API routes
 * 
 * @param userAgent - User agent string from request headers
 * @returns {boolean} true if user agent indicates mobile device
 */
export function isMobileUserAgent(userAgent: string): boolean {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent)
}