'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { formatRelativeDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function SponsorNotificationsPage() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setNotifications(data || []))
  }, [user])

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user?.id).eq('is_read', false)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    toast.success('All marked as read')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal">Notifications</h1>
        <Button variant="ghost" size="sm" onClick={markAllRead} icon={<CheckCheck className="h-4 w-4" />}>Mark All Read</Button>
      </div>

      {notifications.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any, i: number) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl border p-4 ${n.is_read ? 'border-gray-100' : 'border-primary/20 bg-light-teal/30'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${n.is_read ? 'bg-gray-300' : 'bg-primary'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${n.is_read ? 'text-gray-600' : 'font-semibold text-charcoal'}`}>{n.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeDate(n.created_at)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
