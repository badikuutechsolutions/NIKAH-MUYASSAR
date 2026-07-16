'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', order_index: 0 })

  useEffect(() => {
    supabase.from('faqs').select('*').order('order_index').then(({ data }) => {
      setFaqs(data || [])
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (editItem) {
      const { error } = await supabase.from('faqs').update(form).eq('id', editItem.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('FAQ updated')
    } else {
      const { error } = await supabase.from('faqs').insert(form)
      if (error) { toast.error('Failed to create'); return }
      toast.success('FAQ created')
    }
    setShowModal(false)
    setEditItem(null)
    const { data } = await supabase.from('faqs').select('*').order('order_index')
    setFaqs(data || [])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    setFaqs((prev) => prev.filter((f) => f.id !== id))
    toast.success('FAQ deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal">FAQs</h1>
        <Button variant="primary" onClick={() => { setEditItem(null); setForm({ question: '', answer: '', category: 'general', order_index: faqs.length }); setShowModal(true) }} icon={<Plus className="h-4 w-4" />}>
          Add FAQ
        </Button>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" size="sm">{faq.category}</Badge>
                  {!faq.is_active && <Badge variant="default" size="sm" className="bg-gray-100 text-gray-500">Inactive</Badge>}
                </div>
                <p className="font-medium text-charcoal">{faq.question}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button variant="ghost" size="sm" onClick={() => { setEditItem(faq); setForm(faq); setShowModal(true) }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit FAQ' : 'Add FAQ'} size="lg">
        <div className="p-6 space-y-4">
          <Input label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <Textarea label="Answer" value={form.answer} onChange={(e: any) => setForm({ ...form, answer: e.target.value })} />
          <Select label="Category" options={[{ value: 'general', label: 'General' }, { value: 'applicant', label: 'Applicant' }, { value: 'sponsor', label: 'Sponsor' }, { value: 'process', label: 'Process' }, { value: 'islamic', label: 'Islamic' }]} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={handleSave}>{editItem ? 'Update' : 'Create'} FAQ</Button>
        </div>
      </Modal>
    </div>
  )
}
