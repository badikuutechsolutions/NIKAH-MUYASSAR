'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { toast.error(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-display font-bold text-charcoal mb-2">Check Your Email</h1>
        <p className="text-gray-500 mb-6">We've sent you a password reset link. Please check your inbox.</p>
        <Link href="/login"><Button variant="primary">Back to Sign In</Button></Link>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-2">Forgot Password</h1>
      <p className="text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email Address" type="email" placeholder="Enter your email" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" variant="primary" className="w-full" loading={loading}>Send Reset Link</Button>
      </form>
      <Link href="/login" className="flex items-center gap-1 text-sm text-primary mt-4 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Sign In</Link>
    </motion.div>
  )
}
