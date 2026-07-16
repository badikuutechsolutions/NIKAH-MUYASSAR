'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Video, Phone, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { formatDate } from '@/lib/utils'

export default function MeetingsPage() {
  const { user } = useUser()
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('meetings').select('*').eq('applicant_id', user.id).order('meeting_date', { ascending: false }).then(({ data }) => {
      setMeetings(data || [])
      setLoading(false)
    })
  }, [user])

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">My Meetings</h1>

      {meetings.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No meetings scheduled yet.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {meetings.map((m: any) => (
            <Card key={m.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {m.meeting_type === 'video' ? <Video className="h-5 w-5 text-primary mt-1" /> : m.meeting_type === 'phone' ? <Phone className="h-5 w-5 text-primary mt-1" /> : <MapPin className="h-5 w-5 text-primary mt-1" />}
                    <div>
                      <p className="font-semibold text-charcoal capitalize">{m.meeting_type} Meeting</p>
                      <p className="text-sm text-gray-500">{formatDate(m.meeting_date)}</p>
                      {m.meeting_link && <a href={m.meeting_link} target="_blank" className="text-xs text-primary hover:underline">Join Meeting</a>}
                      {m.agenda && <p className="text-xs text-gray-400 mt-1">{m.agenda}</p>}
                    </div>
                  </div>
                  <Badge variant="status" status={m.status === 'scheduled' ? 'pending' : m.status === 'completed' ? 'approved' : 'rejected'}>{m.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
