import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  const { data: { user } } = await (await createRouteHandlerClient({ cookies })).auth.getUser()
  const role = user?.app_metadata?.role

  // New Google users don't have a role yet — send them to choose
  if (!role) {
    return NextResponse.redirect(new URL('/choose-role', requestUrl.origin))
  }

  const redirects: Record<string, string> = {
    applicant: '/dashboard',
    sponsor: '/sponsor/dashboard',
    admin: '/admin/dashboard',
    reviewer: '/admin/dashboard',
  }

  return NextResponse.redirect(new URL(redirects[role] || '/', requestUrl.origin))
}
