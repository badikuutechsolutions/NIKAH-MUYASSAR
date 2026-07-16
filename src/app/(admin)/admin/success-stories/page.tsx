'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ couple_alias: '', story_text: '', story_excerpt: '', country: '', is_published: false, is_featured: false })

  useEffect(() => {
    supabase.from('success_stories').select('*').order('created_at', { ascending: false }).then(({ data }) => setStories(data || []))
  }, [])

  const handleSave = async () => {
    if (editItem) {
      await supabase.from('success_stories').update(form).eq('id', editItem.id)
      toast.success('Story updated')
    } else {
      await supabase.from('success_stories').insert(form)
      toast.success('Story created')
    }
    setShowModal(false)
    setEditItem(null)
    const { data } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false })
    setStories(data || [])
  }

  const togglePublish = async (story: any) => {
    await supabase.from('success_stories').update({ is_published: !story.is_published }).eq('id', story.id)
    setStories((prev) => prev.map((s) => s.id === story.id ? { ...s, is_published: !s.is_published } : s))
    toast.success(story.is_published ? 'Unpublished' : 'Published')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story?')) return
    await supabase.from('success_stories').delete().eq('id', id)
    setStories((prev) => prev.filter((s) => s.id !== id))
    toast.success('Story deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal">Success Stories</h1>
        <Button variant="primary" onClick={() => { setEditItem(null); setForm({ couple_alias: '', story_text: '', story_excerpt: '', country: '', is_published: false, is_featured: false }); setShowModal(true) }} icon={<Plus className="h-4 w-4" />}>
          Add Story
        </Button>
      </div>

      <div className="space-y-2">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-charcoal">{story.couple_alias}</span>
                  {story.is_featured && <Badge variant="default" size="sm" className="bg-secondary text-white">Featured</Badge>}
                  {story.is_published ? <Badge variant="default" size="sm" className="bg-green-100 text-green-700">Published</Badge> : <Badge variant="default" size="sm" className="bg-gray-100 text-gray-500">Draft</Badge>}
                </div>
                {story.country && <p className="text-xs text-gray-400">{story.country}</p>}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => togglePublish(story)}>
                  {story.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setEditItem(story); setForm(story); setShowModal(true) }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(story.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Story' : 'Add Story'} size="lg">
        <div className="p-6 space-y-4">
          <Input label="Couple Alias" placeholder='e.g. "Ahmed & Fatima from Morocco"' value={form.couple_alias} onChange={(e) => setForm({ ...form, couple_alias: e.target.value })} />
          <Textarea label="Full Story" value={form.story_text} onChange={(e: any) => setForm({ ...form, story_text: e.target.value })} />
          <Input label="Excerpt (Short)" value={form.story_excerpt} onChange={(e) => setForm({ ...form, story_excerpt: e.target.value })} />
          <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm">Featured</span>
            </label>
          </div>
          <Button variant="primary" className="w-full" onClick={handleSave}>{editItem ? 'Update' : 'Create'} Story</Button>
        </div>
      </Modal>
    </div>
  )
}
