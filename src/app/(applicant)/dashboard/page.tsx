'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Calendar, Bell, ChevronRight, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { formatDate, formatRelativeDate, getStatusColor, getCountryFlag } from '@/lib/utils'
import { DUA_FOR_MARRIAGE } from '@/lib/constants'
import { ArabicText } from '@/components/ui/arabic-text'

const STATUS_FLOW = ['pending', 'under_review', 'approved', 'sponsored', 'completed']

const STATUS_DETAILS: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending Review', color: 'bg-gray-100 text-gray-800', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800', icon: Loader2 },
  info_requested: { label: 'Info Requested', color: 'bg-amber-100 text-amber-800', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  sponsored: { label: 'Sponsored', color: 'bg-teal-100 text-teal-800', icon: CheckCircle2 },
  partially_funded: { label: 'Partially Funded', color: 'bg-teal-100 text-teal-800', icon: CheckCircle2 },
  fully_funded: { label: 'Fully Funded', color: 'bg-yellow-100 text-yellow-800', icon: CheckCircle2 },
  completed: { label: 'Completed 🎉', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  rejected: { label: 'Not Approved', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-600', icon: Clock },
}

export default function ApplicantDashboard() {
  const { user, profile } = useUser()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const { data: app } = await supabase
        .from('applications')
        .select('*')
        .eq('applicant_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()
      setApplication(app)

      const { data: meets } = await supabase
        .from('meetings')
        .select('*')
        .eq('applicant_id', user.id)
        .order('meeting_date', { ascending: false })
        .limit(5)
      setMeetings(meets || [])

      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setNotifications(notifs || [])
      setLoading(false)
    }
    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  const currentStatusIndex = application ? STATUS_FLOW.indexOf(application.status) : -1
  const StatIcon = application ? STATUS_DETAILS[application.status]?.icon || Clock : Clock

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-display font-bold text-charcoal">
          Assalamu Alaikum, {profile?.full_name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-500">Here's your application overview</p>
      </div>

      {!application ? (
        /* No application yet */
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-charcoal mb-2">No Application Yet</h2>
            <p className="text-gray-500 mb-4">Start your journey to completing half your Deen.</p>
            <Link href="/apply">
              <Button variant="primary">Start Your Application</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Status Card */}
          <Card className="border-l-4"
            style={{
              borderLeftColor: application.status === 'pending' ? '#6B7280' :
                application.status === 'under_review' ? '#3B82F6' :
                application.status === 'approved' ? '#10B981' :
                application.status === 'sponsored' ? '#0D7377' :
                application.status === 'completed' ? '#F4A81D' : '#6B7280'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Application Status</p>
                  <Badge variant="status" status={application.status} size="md">
                    {STATUS_DETAILS[application.status]?.label || application.status}
                  </Badge>
                </div>
                <StatIcon className="h-8 w-8 text-gray-300" />
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-1 mt-4">
                {STATUS_FLOW.map((s, i) => {
                  const isActive = i <= currentStatusIndex
                  const isCurrent = i === currentStatusIndex
                  return (
                    <div key={s} className="flex-1 flex items-center">
                      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-200'} ${isCurrent ? 'ring-2 ring-primary/30' : ''}`} />
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={`flex-1 h-0.5 ${i < currentStatusIndex ? 'bg-primary' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Submitted</span>
                <span>Under Review</span>
                <span>Approved</span>
                <span>Sponsored</span>
                <span>Completed</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Application details */}
            <Link href="/dashboard/application">
              <Card hover>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-charcoal flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Application</h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Looking for</span><span className="font-medium">KSh ${application.amount_requested}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Raised</span><span className="font-medium text-primary">KSh ${application.amount_raised}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Country</span><span className="font-medium">{getCountryFlag(application.country_of_residence)} {application.country_of_residence}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="font-medium">{formatRelativeDate(application.submitted_at)}</span></div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Meetings */}
            <Link href="/dashboard/meetings">
              <Card hover>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-charcoal flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Meetings</h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  {meetings.length > 0 ? (
                    <div className="space-y-2">
                      {meetings.slice(0, 2).map((m: any) => (
                        <div key={m.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${m.status === 'scheduled' ? 'bg-blue-500' : m.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-gray-600">{m.meeting_type} - {formatDate(m.meeting_date)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No meetings scheduled yet.</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Notifications */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-charcoal flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Recent Notifications</h3>
                <Link href="/dashboard/notifications" className="text-xs text-primary hover:underline">View all</Link>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-2">
                  {notifications.map((n: any) => (
                    <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${n.is_read ? 'bg-gray-300' : 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">{n.title}</p>
                        <p className="text-xs text-gray-400">{formatRelativeDate(n.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No notifications yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Du'a */}
          <Card className="bg-gradient-to-br from-soft to-white border-accent/20">
            <CardContent className="p-5 text-center">
              <ArabicText text={DUA_FOR_MARRIAGE.arabic} size="md" className="text-primary mb-2" />
              <p className="text-xs text-gray-500 italic">{DUA_FOR_MARRIAGE.translation}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
