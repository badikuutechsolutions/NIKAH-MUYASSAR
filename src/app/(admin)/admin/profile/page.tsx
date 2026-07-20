'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Save, Camera, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { toast } from 'sonner'

export default function AdminProfilePage() {
  const { user, profile, loading } = useUser()
  const [form, setForm] = useState({ full_name: '', phone: '', country: '', city: '', bio: '' })
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        city: profile.city || '',
        bio: profile.bio || '',
      })
      setProfilePhoto(profile.profile_photo || null)
    }
  }, [profile])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) { toast.error('Please upload a JPG or PNG image'); return }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', `profiles/${user?.id}`)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setProfilePhoto(data.secure_url)
      toast.success('Photo uploaded')
    } catch { toast.error('Failed to upload photo') }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const updateData: any = { ...form }
    if (profilePhoto) updateData.profile_photo = profilePhoto
    const { error } = await supabase.from('profiles').update(updateData).eq('id', user?.id)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success('Profile updated')
    setSaving(false)
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Profile Settings</h1>
      <Card>
        <CardContent className="p-6 space-y-4 max-w-lg">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {form.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'}
                  </span>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-md hover:bg-secondary-dark transition-colors"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-charcoal">{form.full_name}</h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>

          <Input label="Full Name" icon={<User className="h-4 w-4" />} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
          <Input label="Phone" icon={<Phone className="h-4 w-4" />} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Country" icon={<MapPin className="h-4 w-4" />} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <Input label="City" icon={<MapPin className="h-4 w-4" />} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Bio</label>
            <textarea className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-charcoal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <Button variant="primary" onClick={handleSave} loading={saving} icon={<Save className="h-4 w-4" />}>Save Changes</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
