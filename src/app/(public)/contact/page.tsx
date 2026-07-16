'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', category: 'general' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to send')
      toast.success('Message sent! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <Badge variant="default" size="md" className="mb-3">📩 Contact Us</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Have a question, suggestion, or want to partner with us? We&apos;d love to hear from you.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Your Name" type="text" placeholder="Enter your full name" icon={<User className="h-4 w-4" />} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email Address" type="email" placeholder="Enter your email" icon={<Mail className="h-4 w-4" />} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Select label="Category" options={[{ value: 'general', label: 'General Inquiry' }, { value: 'application', label: 'Application Question' }, { value: 'sponsorship', label: 'Sponsorship Question' }, { value: 'technical', label: 'Technical Issue' }, { value: 'media', label: 'Media Inquiry' }, { value: 'other', label: 'Other' }]} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          <Input label="Subject" type="text" placeholder="What is this about?" icon={<MessageSquare className="h-4 w-4" />} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
          <Textarea label="Message" placeholder="Write your message here..." showCount maxLength={2000} value={formData.message} onChange={(e: any) => setFormData({ ...formData, message: e.target.value })} required />
          <Button type="submit" variant="primary" className="w-full" loading={loading} icon={<Send className="h-4 w-4" />}>Send Message</Button>
        </form>
      </motion.div>
    </div>
  )
}
