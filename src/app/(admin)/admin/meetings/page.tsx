'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).then(({ data }) => {
      setMeetings(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">All Meetings</h1>
      <div className="space-y-2">
        {meetings.map((m: any) => (
          <Card key={m.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-charcoal">
                  {m.meeting_type} Meeting — {formatDate(m.meeting_date)}
                </p>
                <p className="text-sm text-gray-500">{m.agenda || 'No agenda'}</p>
              </div>
              <Badge variant="status" status={m.status === 'scheduled' ? 'pending' : m.status === 'completed' ? 'approved' : 'rejected'}>
                {m.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
        {meetings.length === 0 && <div className="text-center py-12 text-gray-500">No meetings scheduled.</div>}
      </div>
    </div>
  )
}
