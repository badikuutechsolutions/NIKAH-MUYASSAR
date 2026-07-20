import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  const { data, error } = await supabase.from('contact_messages').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify admins about new contact message
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
  if (admins) {
    await supabase.from('notifications').insert(
      admins.map((a: any) => ({
        user_id: a.id,
        type: 'system_announcement' as const,
        title: 'New Contact Message',
        message: `${body.name} sent: "${body.message?.slice(0, 100)}..."`,
        link: '/admin/contact-messages',
      }))
    )
  }

  return NextResponse.json({ message: 'Message sent successfully', id: data.id }, { status: 201 })
}
