import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Auth pages - redirect to dashboard if logged in
  const authPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password']
  if (authPaths.some(p => path.startsWith(p)) && session) {
    const role = session.user?.app_metadata?.role || session.user?.user_metadata?.role || 'applicant'
    return NextResponse.redirect(new URL(getDashboardUrl(role), req.url))
  }

  // Protected routes
  if (path.startsWith('/apply') || path.startsWith('/dashboard')) {
    if (!session) return redirectToLogin(req)
    const role = session.user?.app_metadata?.role || session.user?.user_metadata?.role
    if (role !== 'applicant') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  if (path.startsWith('/sponsor')) {
    if (!session) return redirectToLogin(req)
    const role = session.user?.app_metadata?.role || session.user?.user_metadata?.role
    if (role !== 'sponsor') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  if (path.startsWith('/admin')) {
    if (!session) return redirectToLogin(req)
    const role = session.user?.app_metadata?.role || session.user?.user_metadata?.role
    if (!['admin', 'reviewer'].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // API route protection
  if (path.startsWith('/api/admin') && !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return res
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

function getDashboardUrl(role: string): string {
  const urls: Record<string, string> = {
    applicant: '/dashboard',
    sponsor: '/sponsor/dashboard',
    admin: '/admin/dashboard',
    reviewer: '/admin/dashboard',
  }
  return urls[role] || '/'
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/public).*)',
  ],
}
