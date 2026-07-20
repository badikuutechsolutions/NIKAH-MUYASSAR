'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, User, Phone, Globe, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { BRAND } from '@/lib/constants'

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

  const contactInfo = [
    { icon: Mail, label: 'Main Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: Mail, label: 'Secondary Email', value: BRAND.supportEmail, href: `mailto:${BRAND.supportEmail}` },
    { icon: Phone, label: 'WhatsApp 1', value: '+254 701 881 929', href: `https://wa.me/254701881929` },
    { icon: Phone, label: 'WhatsApp 2', value: '+254 726 903 363', href: `https://wa.me/254726903363` },
  ]

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <Badge variant="default" size="md" className="mb-3">Contact Us</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Have a question, suggestion, or want to partner with us? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Cards */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h2 className="text-xl font-display font-bold text-charcoal mb-4">Reach Us Directly</h2>
          {contactInfo.map((item, i) => {
            const Icon = item.icon
            return (
              <Card key={i} hover>
                <CardContent className="p-4">
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-charcoal">{item.value}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-300" />
                  </a>
                </CardContent>
              </Card>
            )
          })}

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Quick WhatsApp Chat</p>
                  <p className="text-sm text-gray-600">Tap any number above to start a WhatsApp conversation directly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-display font-bold text-charcoal mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Your Name" type="text" placeholder="Enter your full name" icon={<User className="h-4 w-4" />} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Email Address" type="email" placeholder="Enter your email" icon={<Mail className="h-4 w-4" />} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Select label="Category" options={[
              { value: 'general', label: 'General Inquiry' },
              { value: 'application', label: 'Application Question' },
              { value: 'sponsorship', label: 'Sponsorship Question' },
              { value: 'technical', label: 'Technical Issue' },
              { value: 'media', label: 'Media Inquiry' },
              { value: 'other', label: 'Other' },
            ]} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <Input label="Subject" type="text" placeholder="What is this about?" icon={<MessageSquare className="h-4 w-4" />} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
            <Textarea label="Message" placeholder="Write your message here..." showCount maxLength={2000} value={formData.message} onChange={(e: any) => setFormData({ ...formData, message: e.target.value })} required />
            <Button type="submit" variant="primary" className="w-full" loading={loading} icon={<Send className="h-4 w-4" />}>Send Message</Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
