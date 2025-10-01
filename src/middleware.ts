import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

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
    // Using getUser() instead of getSession() for security
    const { data: { user } } = await supabase.auth.getUser()

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register', '/apply-church']

    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/public'))

    // If no user and trying to access protected route
    if (!user && !isPublicRoute) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // If has user but trying to access auth pages
    if (user && (pathname === '/login' || pathname === '/register')) {
      // Get user profile to determine redirect (with error handling)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          // Redirect based on role
          if (profile.role === 'CHURCH_ADMIN' || profile.role === 'SYSTEM_ADMIN') {
            url.pathname = '/church'
          } else {
            url.pathname = '/member'
          }
          return NextResponse.redirect(url)
        }
        // If no profile, allow access to auth pages to show error
      } catch (error) {
        // Don't redirect if profile doesn't exist - let the page handle it
        // This prevents redirect loops when database isn't set up
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
      } catch (error) {
        // Allow access if profile doesn't exist (development fallback)
      }
    }

    return res
  } catch (error) {
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