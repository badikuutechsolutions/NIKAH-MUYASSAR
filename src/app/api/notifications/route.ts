import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const isRead = searchParams.get('is_read')
  const limit = parseInt(searchParams.get('limit') || '20')

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)

  if (isRead === 'false') query = query.eq('is_read', false)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()
  const { data, error } = await supabase.from('notifications').insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
