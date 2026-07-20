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
import { Plus, Calendar, Video, Phone, MapPin, Search } from 'lucide-react'

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [applications, setApplications] = useState<any[]>([])
  const [appSearch, setAppSearch] = useState('')
  const [form, setForm] = useState({
    application_id: '', applicant_id: '', meeting_type: 'video',
    meeting_date: '', duration_mins: 30, timezone: 'Africa/Nairobi',
    meeting_link: '', agenda: '',
  })

  const fetchMeetings = () => {
    supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).then((res: any) => {
      setMeetings(res.data || [])
      setLoading(false)
    })
  }

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select('id, full_name, applicant_id, country_of_residence, status')
      .in('status', ['pending', 'under_review', 'approved'])
      .order('submitted_at', { ascending: false })
    setApplications(data || [])
  }

  useEffect(() => { fetchMeetings() }, [])

  const openCreateModal = () => {
    fetchApplications()
    setShowCreate(true)
  }

  const handleCreate = async () => {
    if (!form.application_id || !form.applicant_id || !form.meeting_date) {
      toast.error('Please select an application and set date/time'); return
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
    setForm({ application_id: '', applicant_id: '', meeting_type: 'video', meeting_date: '', duration_mins: 30, timezone: 'Africa/Nairobi', meeting_link: '', agenda: '' })
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

  const filteredApps = applications.filter((a) => {
    if (!appSearch) return true
    const q = appSearch.toLowerCase()
    return a.full_name?.toLowerCase().includes(q) || a.country_of_residence?.toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal">Meetings</h1>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="h-4 w-4" />}>
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
            <p className="text-sm">Click "Schedule Meeting" to create one</p>
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Schedule a Meeting" size="lg">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Select Application *</label>
            <Input type="text" placeholder="Search by name or country..." icon={<Search className="h-4 w-4" />} value={appSearch} onChange={(e) => setAppSearch(e.target.value)} className="mb-2" />
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredApps.length === 0 ? (
                <p className="p-3 text-sm text-gray-400 text-center">No applications found</p>
              ) : (
                filteredApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setForm({ ...form, application_id: app.id, applicant_id: app.applicant_id })}
                    className={`w-full text-left p-3 text-sm border-b border-gray-50 hover:bg-light-teal transition-colors ${
                      form.application_id === app.id ? 'bg-light-teal border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <span className="font-medium text-charcoal">{app.full_name}</span>
                    <span className="text-gray-400 ml-2">{app.country_of_residence}</span>
                    <Badge variant="status" status={app.status} size="sm" className="ml-2">{app.status}</Badge>
                  </button>
                ))
              )}
            </div>
          </div>

          {form.application_id && (
            <>
              <Select label="Meeting Type" options={[
                { value: 'video', label: 'Video Call (Zoom/Google Meet)' },
                { value: 'phone', label: 'Phone Call' },
                { value: 'in_person', label: 'In Person' },
              ]} value={form.meeting_type} onChange={(e) => setForm({ ...form, meeting_type: e.target.value })} />

              <Input label="Date & Time *" type="datetime-local" value={form.meeting_date} onChange={(e) => setForm({ ...form, meeting_date: e.target.value })} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Duration (minutes)" type="number" value={form.duration_mins.toString()} onChange={(e) => setForm({ ...form, duration_mins: parseInt(e.target.value) || 30 })} />
                <Select label="Timezone" options={[
                  { value: 'Africa/Nairobi', label: 'East Africa (EAT)' },
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'Eastern US (EST)' },
                  { value: 'Europe/London', label: 'London (GMT)' },
                  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
                  { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
                ]} value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
              </div>

              <Input label="Meeting Link" type="url" placeholder="https://meet.google.com/..." value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} />
              <Textarea label="Agenda" placeholder="What will be discussed?" value={form.agenda} onChange={(e: any) => setForm({ ...form, agenda: e.target.value })} />

              <Button variant="primary" className="w-full" onClick={handleCreate} loading={saving} icon={<Calendar className="h-4 w-4" />}>
                Schedule Meeting
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
