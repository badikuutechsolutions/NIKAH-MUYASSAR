import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const sponsorId = searchParams.get('sponsor_id')
  const appId = searchParams.get('application_id')
  const role = session.user.app_metadata?.role

  let query = supabase.from('sponsorships').select('*')
  if (role === 'sponsor') query = query.eq('sponsor_id', session.user.id)
  else if (role === 'applicant') query = query.eq('application_id', appId || '')
  else if (!['admin', 'reviewer'].includes(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  if (sponsorId) query = query.eq('sponsor_id', sponsorId)
  if (appId) query = query.eq('application_id', appId)

  const { data, error } = await query.order('pledged_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.app_metadata?.role !== 'sponsor') {
    return NextResponse.json({ error: 'Only sponsors can create pledges' }, { status: 403 })
  }

  const body = await request.json()

  // Start a transaction-like flow
  const { data: sponsorship, error: spError } = await supabase
    .from('sponsorships')
    .insert({ ...body, sponsor_id: session.user.id })
    .select()
    .single()

  if (spError) return NextResponse.json({ error: spError.message }, { status: 500 })

  // Update the application's amount_raised
  await supabase.rpc('update_application_amount_raised', { app_id: body.application_id })

  // Create a notification for the applicant
  await supabase.from('notifications').insert({
    user_id: body.application_id, // This would need the applicant_id lookup
    type: 'sponsorship_received',
    title: 'New Sponsorship Received!',
    message: `A generous sponsor has pledged $${body.amount_pledged} toward your wedding.`,
    metadata: { sponsorship_id: sponsorship.id, amount: body.amount_pledged },
  })

  return NextResponse.json(sponsorship, { status: 201 })
}
