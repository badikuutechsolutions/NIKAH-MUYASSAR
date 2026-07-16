import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const role = session.user.app_metadata?.role
  let query = supabase.from('applications').select('*')

  if (role === 'applicant') {
    query = query.eq('applicant_id', session.user.id)
  } else if (role === 'sponsor') {
    query = query.in('status', ['approved', 'sponsored', 'partially_funded'])
  } else if (!['admin', 'reviewer'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (status) query = query.eq('status', status)

  const { data, error } = await query
    .order('submitted_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.app_metadata?.role !== 'applicant') {
    return NextResponse.json({ error: 'Only applicants can submit applications' }, { status: 403 })
  }

  const body = await request.json()
  const { data, error } = await supabase
    .from('applications')
    .insert({ ...body, applicant_id: session.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
