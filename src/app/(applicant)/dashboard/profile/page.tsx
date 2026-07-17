'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, profile, loading } = useUser()
  const [form, setForm] = useState({ full_name: '', phone: '', whatsapp: '', country: '', city: '', bio: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        country: profile.country || '',
        city: profile.city || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update(form).eq('id', user?.id)
    if (error) { console.error('Profile update error:', error); toast.error(error.message); setSaving(false); return }
    toast.success('Profile updated successfully')
    setSaving(false)
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Profile Settings</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {form.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">{form.full_name}</h2>
              <p className="text-sm text-gray-500 capitalize">{profile?.role}</p>
            </div>
          </div>

          <Input label="Full Name" type="text" icon={<User className="h-4 w-4" />} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" type="tel" icon={<Phone className="h-4 w-4" />} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="WhatsApp" type="tel" icon={<Phone className="h-4 w-4" />} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Country" type="text" icon={<MapPin className="h-4 w-4" />} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <Input label="City" type="text" icon={<MapPin className="h-4 w-4" />} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Bio</label>
            <textarea className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-charcoal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <Button variant="primary" onClick={handleSave} loading={saving} icon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
