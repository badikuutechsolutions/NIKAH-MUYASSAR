import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [appsRes, sponsorsRes, statsRes] = await Promise.all([
    supabase.from('applications').select('*'),
    supabase.from('profiles').select('*').eq('role', 'sponsor'),
    supabase.from('platform_stats').select('*').single(),
  ])

  const applications = appsRes.data || []
  const sponsors = sponsorsRes.data || []

  return NextResponse.json({
    total_applications: applications.length,
    pending: applications.filter((a: any) => a.status === 'pending').length,
    under_review: applications.filter((a: any) => a.status === 'under_review').length,
    approved: applications.filter((a: any) => a.status === 'approved').length,
    sponsored: applications.filter((a: any) => ['sponsored', 'partially_funded', 'fully_funded'].includes(a.status)).length,
    completed: applications.filter((a: any) => a.status === 'completed').length,
    rejected: applications.filter((a: any) => a.status === 'rejected').length,
    total_sponsors: sponsors.length,
    total_amount_raised: applications.reduce((sum: number, a: any) => sum + Number(a.amount_raised || 0), 0),
    countries_count: new Set(applications.map((a: any) => a.country_of_residence)).size,
    stats: statsRes.data,
  })
}
