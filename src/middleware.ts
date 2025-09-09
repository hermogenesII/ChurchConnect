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
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register']
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/public'))

  // If no session and trying to access protected route
  if (!session && !isPublicRoute) {
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

  // Redirect root dashboard to role-specific dashboard
  if (session && pathname === '/dashboard') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      if (profile.role === 'CHURCH_ADMIN' || profile.role === 'SYSTEM_ADMIN') {
        url.pathname = '/church'
      } else {
        url.pathname = '/member'
      }
      return NextResponse.redirect(url)
    }
  }

  return res
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