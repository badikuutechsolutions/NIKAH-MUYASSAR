import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  // Allow both admin session OR if no admin exists yet (first setup)
  const { data: { session } } = await supabase.auth.getSession()

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  const noAdminExists = count === 0

  if (!noAdminExists && (!session || session.user.app_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { role } = await request.json()
  if (!['applicant', 'sponsor', 'reviewer', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Update profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', params.id)

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  // Update auth.users app_metadata using service role
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error: authError } = await serviceClient.auth.admin.updateUserById(params.id, {
    app_metadata: { role },
    user_metadata: { role },
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

  return NextResponse.json({ message: 'Role updated successfully' })
}
