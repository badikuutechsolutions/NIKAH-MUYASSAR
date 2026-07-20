'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArabicText } from '@/components/ui/arabic-text'

export default function SetupPage() {
  const [checking, setChecking] = useState(true)
  const [hasAdmin, setHasAdmin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')
      setHasAdmin(count !== null && count > 0)
      setChecking(false)
    }
    checkAdmin()
  }, [])

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'admin' },
      },
    })

    if (signUpError) { toast.error(signUpError.message); setLoading(false); return }

    if (user) {
      // Set role in profiles and app_metadata
      await supabase.from('profiles').upsert({
        id: user.id,
        email,
        full_name: fullName,
        role: 'admin',
      })

      toast.success('Admin account created! Please check your email to verify, then sign in.')
      router.push('/login')
    }
    setLoading(false)
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>

  if (hasAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-charcoal mb-2">Already Set Up</h1>
          <p className="text-gray-500 mb-4">An admin account already exists. Please sign in with admin credentials.</p>
          <Button variant="primary" onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <Badge variant="default" size="md" className="mb-3">First-Time Setup</Badge>
          <h1 className="text-3xl font-display font-bold text-charcoal">Create Admin Account</h1>
          <p className="text-gray-500 text-sm mt-2">Set up the first administrator for the platform</p>
        </div>

        <form onSubmit={handleSetup} className="space-y-4">
          <Input label="Full Name" type="text" placeholder="Admin name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Email Address" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="relative">
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400"><EyeOff className="h-4 w-4" /></button>
          </div>
          <Button type="submit" variant="primary" className="w-full" loading={loading} icon={<Shield className="h-4 w-4" />}>
            Create Admin Account
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
