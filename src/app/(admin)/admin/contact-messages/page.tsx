'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then((res: any) => {
      setMessages(res.data || [])
      setLoading(false)
    })
  }, [])

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
    toast.success('Deleted')
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Contact Messages</h1>
      <div className="space-y-2">
        {messages.map((msg) => (
          <Card key={msg.id} hover onClick={() => setSelected(msg)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-2 h-2 rounded-full ${msg.is_resolved ? 'bg-gray-300' : 'bg-primary'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal">{msg.name}</span>
                    <Badge variant="default" size="sm">{msg.category}</Badge>
                    {msg.is_resolved && <Badge variant="default" size="sm" className="bg-green-100 text-green-700">Resolved</Badge>}
                  </div>
                  <p className="text-sm text-gray-500">{msg.subject}</p>
                  <p className="text-xs text-gray-400">{formatDate(msg.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!msg.is_resolved && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); markResolved(msg.id) }} className="text-green-600"><CheckCircle className="h-4 w-4" /></Button>}
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && <div className="text-center py-12 text-gray-500"><Mail className="h-10 w-10 mx-auto mb-3 text-gray-300" />No messages yet.</div>}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Message from ${selected?.name}`} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">From:</span> {selected?.name}</div>
            <div><span className="text-gray-500">Email:</span> {selected?.email}</div>
            <div><span className="text-gray-500">Category:</span> {selected?.category}</div>
            <div><span className="text-gray-500">Date:</span> {selected && formatDate(selected.created_at)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-2">{selected?.subject}</h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">{selected?.message}</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
