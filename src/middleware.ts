import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Only log for main routes, not assets
  if (!req.nextUrl.pathname.startsWith('/_next') && !req.nextUrl.pathname.includes('.')) {
    console.log('Middleware called for:', req.nextUrl.pathname)
  }
  
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
          console.log(`Setting cookie ${name}`)
          res.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          })
        },
        remove(name: string, options: Record<string, unknown> = {}) {
          console.log(`Removing cookie ${name}`)
          res.cookies.set({
            name,
            value: '',
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
          })
        },
      },
    }
  )

  const url = req.nextUrl.clone()
  const pathname = url.pathname
   console.log('------> Current url:', url)
  console.log('--------> Current pathname:', pathname)

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Session check:', { hasSession: !!session, error, pathname })

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register']
    
    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/public'))

    // If no session and trying to access protected route
    if (!session && !isPublicRoute) {
      console.log('Redirecting to login - no session detected')
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // If has session but trying to access auth pages
    if (session && (pathname === '/login' || pathname === '/register')) {
      // Get user profile to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
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
    }

    // Role-based route protection
    if (session && pathname.startsWith('/church')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile && profile.role !== 'CHURCH_ADMIN' && profile.role !== 'SYSTEM_ADMIN') {
        url.pathname = '/member'
        return NextResponse.redirect(url)
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
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