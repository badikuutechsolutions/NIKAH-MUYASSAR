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

  // Create sponsorship record
  const { data: sponsorship, error: spError } = await supabase
    .from('sponsorships')
    .insert({ ...body, sponsor_id: session.user.id })
    .select()
    .single()

  if (spError) return NextResponse.json({ error: spError.message }, { status: 500 })

  // Look up the applicant's user ID for this application
  const { data: application } = await supabase
    .from('applications')
    .select('applicant_id, amount_raised, amount_requested')
    .eq('id', body.application_id)
    .single()

  if (application) {
    // Update amount_raised directly
    const newRaised = Number(application.amount_raised) + Number(body.amount_pledged)
    await supabase
      .from('applications')
      .update({ amount_raised: newRaised })
      .eq('id', body.application_id)

    // Update status if fully funded
    if (newRaised >= Number(application.amount_requested)) {
      await supabase
        .from('applications')
        .update({ status: 'fully_funded' })
        .eq('id', body.application_id)
    } else {
      await supabase
        .from('applications')
        .update({ status: 'partially_funded', sponsor_id: session.user.id })
        .eq('id', body.application_id)
    }

    // Create notification for the applicant
    await supabase.from('notifications').insert({
      user_id: application.applicant_id,
      type: 'sponsorship_received',
      title: 'New Sponsorship Received!',
      message: `A generous sponsor has pledged KSh ${body.amount_pledged} toward your wedding.`,
      metadata: { sponsorship_id: sponsorship.id, amount: body.amount_pledged, sponsor_id: session.user.id },
    })
  }

  return NextResponse.json({
    ...sponsorship,
    payment_instructions: 'Thank you for your pledge! Please make your payment via M-Pesa to +254742773562 (Hamoudy Badi) and send the confirmation message to the same number. Your pledge will be confirmed once payment is received.',
  }, { status: 201 })
}
