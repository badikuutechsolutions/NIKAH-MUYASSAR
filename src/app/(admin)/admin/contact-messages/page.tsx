'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Trash2, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { BRAND } from '@/lib/constants'

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const fetchMessages = () => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then((res: any) => {
      setMessages(res.data || [])
      setLoading(false)
    })
  }

  useEffect(() => { fetchMessages() }, [])

  const markResolved = async (id: string) => {
    const { error } = await supabase.from('contact_messages').update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_resolved: true } : m))
    toast.success('Marked as resolved')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success('Deleted')
  }

  const handleReply = async () => {
    if (!replyText.trim()) { toast.error('Please write a reply'); return }
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin',
          email: BRAND.email,
          subject: `Re: ${selected.subject}`,
          message: replyText,
          category: selected.category,
        }),
      })
      if (!res.ok) throw new Error('Failed to send reply')
      toast.success('Reply sent! (Saved in messages)')
      setReplyText('')
      markResolved(selected.id)
    } catch (err: any) {
      toast.error(err.message || 'Failed to send')
    }
    setSending(false)
  }

  if (loading) return <Skeleton className="h-96 w-full" />

  const unresolved = messages.filter((m) => !m.is_resolved).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal">Contact Messages</h1>
          <p className="text-sm text-gray-500">{messages.length} total &middot; {unresolved} unresolved</p>
        </div>
      </div>

      <div className="space-y-2">
        {messages.map((msg) => (
          <Card key={msg.id} hover onClick={() => setSelected(msg)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${msg.is_resolved ? 'bg-gray-300' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-charcoal">{msg.name}</span>
                    <Badge variant="default" size="sm">{msg.category || 'general'}</Badge>
                    {!msg.is_resolved && <Badge variant="default" size="sm" className="bg-amber-100 text-amber-700">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400">{formatDate(msg.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {!msg.is_resolved && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); markResolved(msg.id) }} className="text-green-600" title="Mark resolved"><CheckCircle className="h-4 w-4" /></Button>}
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }} className="text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-500 mb-1">No messages yet</p>
            <p className="text-sm">Contact form submissions will appear here</p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setReplyText('') }} title={`Message from ${selected?.name}`} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">From:</span> {selected?.name}</div>
            <div><span className="text-gray-500">Email:</span> <a href={`mailto:${selected?.email}`} className="text-primary hover:underline">{selected?.email}</a></div>
            <div><span className="text-gray-500">Category:</span> {selected?.category || 'general'}</div>
            <div><span className="text-gray-500">Date:</span> {selected && formatDate(selected.created_at)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-2">{selected?.subject}</h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">{selected?.message}</p>
          </div>

          <hr className="border-gray-200" />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Reply to {selected?.name}</label>
            <Textarea placeholder="Write your reply..." value={replyText} onChange={(e: any) => setReplyText(e.target.value)} />
            <div className="flex gap-2 mt-3">
              <Button variant="primary" onClick={handleReply} loading={sending} icon={<Send className="h-4 w-4" />}>
                Send Reply
              </Button>
              <Button variant="outline" onClick={() => selected && markResolved(selected.id)}>
                Mark Resolved
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
