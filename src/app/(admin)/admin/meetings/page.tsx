'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus, Calendar, Video, Phone, MapPin } from 'lucide-react'

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    application_id: '', applicant_id: '', meeting_type: 'video',
    meeting_date: '', duration_mins: 30, timezone: 'UTC',
    meeting_link: '', agenda: '',
  })

  const fetchMeetings = () => {
    supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).then((res: any) => {
      setMeetings(res.data || [])
      setLoading(false)
    })
  }

  useEffect(() => { fetchMeetings() }, [])

  const handleCreate = async () => {
    if (!form.application_id || !form.applicant_id || !form.meeting_date) {
      toast.error('Please fill in required fields'); return
    }
    setSaving(true)
    const { error } = await supabase.from('meetings').insert({
      application_id: form.application_id,
      applicant_id: form.applicant_id,
      scheduled_by: (await supabase.auth.getUser()).data.user?.id,
      meeting_type: form.meeting_type,
      meeting_date: form.meeting_date,
      duration_mins: form.duration_mins,
      timezone: form.timezone,
      meeting_link: form.meeting_link || null,
      agenda: form.agenda || null,
    })
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success('Meeting scheduled!')
    setShowCreate(false)
    setForm({ application_id: '', applicant_id: '', meeting_type: 'video', meeting_date: '', duration_mins: 30, timezone: 'UTC', meeting_link: '', agenda: '' })
    fetchMeetings()
    setSaving(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('meetings').update({ status }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    setMeetings((prev) => prev.map((m) => m.id === id ? { ...m, status } : m))
    toast.success(`Meeting ${status}`)
  }

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal">Meetings</h1>
        <Button variant="primary" onClick={() => setShowCreate(true)} icon={<Plus className="h-4 w-4" />}>
          Schedule Meeting
        </Button>
      </div>

      <div className="space-y-2">
        {meetings.map((m: any) => (
          <Card key={m.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {m.meeting_type === 'video' ? <Video className="h-5 w-5 text-primary" /> : m.meeting_type === 'phone' ? <Phone className="h-5 w-5 text-primary" /> : <MapPin className="h-5 w-5 text-primary" />}
                <div>
                  <p className="font-medium text-charcoal">
                    {m.meeting_type} Meeting — {formatDate(m.meeting_date)}
                  </p>
                  <p className="text-xs text-gray-500">{m.agenda || 'No agenda'}</p>
                  {m.meeting_link && <a href={m.meeting_link} target="_blank" className="text-xs text-primary hover:underline">Join Link</a>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="status" status={m.status === 'scheduled' ? 'pending' : m.status === 'completed' ? 'approved' : 'rejected'}>
                  {m.status}
                </Badge>
                {m.status === 'scheduled' && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => updateStatus(m.id, 'completed')} className="text-green-600">Complete</Button>
                    <Button variant="ghost" size="sm" onClick={() => updateStatus(m.id, 'cancelled')} className="text-red-500">Cancel</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {meetings.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-500 mb-1">No meetings scheduled</p>
            <p className="text-sm">Click &quot;Schedule Meeting&quot; to create one</p>
          </div>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Schedule a Meeting" size="lg">
        <div className="p-6 space-y-4">
          <Input label="Application ID *" placeholder="Enter application UUID" value={form.application_id} onChange={(e) => setForm({ ...form, application_id: e.target.value })} />
          <Input label="Applicant ID *" placeholder="Enter applicant user UUID" value={form.applicant_id} onChange={(e) => setForm({ ...form, applicant_id: e.target.value })} />
          <Select label="Meeting Type" options={[{ value: 'video', label: 'Video Call' }, { value: 'phone', label: 'Phone Call' }, { value: 'in_person', label: 'In Person' }]} value={form.meeting_type} onChange={(e) => setForm({ ...form, meeting_type: e.target.value })} />
          <Input label="Date & Time *" type="datetime-local" value={form.meeting_date} onChange={(e) => setForm({ ...form, meeting_date: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" value={form.duration_mins.toString()} onChange={(e) => setForm({ ...form, duration_mins: parseInt(e.target.value) || 30 })} />
            <Input label="Timezone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </div>
          <Input label="Meeting Link (Zoom/Google Meet)" type="url" placeholder="https://meet.google.com/..." value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} />
          <Textarea label="Agenda" placeholder="What will be discussed?" value={form.agenda} onChange={(e: any) => setForm({ ...form, agenda: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={handleCreate} loading={saving} icon={<Calendar className="h-4 w-4" />}>Schedule Meeting</Button>
        </div>
      </Modal>
    </div>
  )
}
