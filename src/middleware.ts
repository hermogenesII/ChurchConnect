import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

/**
 * Middleware for authentication and route protection
 *
 * This middleware:
 * 1. Validates user sessions on every request
 * 2. Protects routes that require authentication
 * 3. Redirects users based on their role (admin vs member)
 * 4. Handles session cookies properly for SSR
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create Supabase client for server-side auth
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get(name)?.value
          return cookie
        },
        set(name: string, value: string, options: Record<string, unknown> = {}) {
          const cookieOptions = {
            name,
            value,
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          }
          res.cookies.set(cookieOptions)
        },
        remove(name: string, options: Record<string, unknown> = {}) {
          const cookieOptions = {
            name,
            value: '',
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
          }
          res.cookies.set(cookieOptions)
        },
      },
    }
  )

  const url = req.nextUrl.clone()
  const pathname = url.pathname

  try {
    // Validate session by contacting Supabase Auth server
    // We use getUser() instead of getSession() because it validates with the auth server
    // This prevents stale session issues
    const { data: { user } } = await supabase.auth.getUser()

    // Define public routes (accessible without authentication)
    const publicRoutes = ['/', '/login', '/register', '/apply-church']
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith('/api/public')
    )

    // Redirect unauthenticated users to login
    if (!user && !isPublicRoute) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && (pathname === '/login' || pathname === '/register')) {
      try {
        // Fetch user profile to determine their role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          // Redirect based on user role
          const isAdmin = profile.role === 'CHURCH_ADMIN' || profile.role === 'SYSTEM_ADMIN'
          url.pathname = isAdmin ? '/church' : '/member'
          return NextResponse.redirect(url)
        }
        // If no profile exists, allow access to show error message on the page
      } catch {
        // If profile fetch fails (e.g., database not set up), allow access
        // The page will show an appropriate error message
      }
    }

    // Role-based route protection
    if (user && pathname.startsWith('/church')) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile && profile.role !== 'CHURCH_ADMIN' && profile.role !== 'SYSTEM_ADMIN') {
          // For now, allow all authenticated users to access /church
          // Later you can create a /member route for regular members
          // url.pathname = '/member'
          // return NextResponse.redirect(url)
        }
      } catch {
        // Allow access if profile doesn't exist (development fallback)
      }
    }

    return res
  } catch {
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
}