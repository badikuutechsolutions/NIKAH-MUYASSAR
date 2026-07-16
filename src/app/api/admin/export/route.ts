import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table') || 'applications'

  const { data } = await supabase.from(table as any).select('*')
  if (!data) return NextResponse.json({ error: 'No data' }, { status: 404 })

  const headers = Object.keys(data[0]).join(',')
  const rows = data.map((row: any) => Object.values(row).join(',')).join('\n')
  const csv = `${headers}\n${rows}`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${table}-export.csv"`,
    },
  })
}
