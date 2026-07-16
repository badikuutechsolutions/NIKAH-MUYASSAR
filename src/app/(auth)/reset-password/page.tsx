'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { toast.error(error.message); setLoading(false); return }
    toast.success('Password updated successfully!')
    router.push('/login')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-2">Reset Password</h1>
      <p className="text-gray-500 mb-6">Enter your new password below.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input label="New Password" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400"><EyeOff className="h-4 w-4" /></button>
        </div>
        <Button type="submit" variant="primary" className="w-full" loading={loading}>Reset Password</Button>
      </form>
    </motion.div>
  )
}
