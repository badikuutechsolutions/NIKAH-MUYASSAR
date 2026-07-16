'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Heart, HandHeart, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArabicText } from '@/components/ui/arabic-text'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'applicant' | 'sponsor' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) { toast.error('Please select a role'); return }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) { toast.error(error.message); setLoading(false); return }

    toast.success('Account created! Please check your email to verify.')
    router.push('/verify-email')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <ArabicText text="نكاح ميسر" size="lg" className="text-primary mb-2" />
        <h1 className="text-2xl font-display font-bold text-charcoal">Join the Ummah</h1>
        <p className="text-gray-500 text-sm mt-1">Create your account and start your journey</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={<User className="h-4 w-4" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password (min 6 characters)"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">I want to join as</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('applicant')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === 'applicant'
                  ? 'border-primary bg-light-teal'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <Heart className={`h-6 w-6 mx-auto mb-1 ${role === 'applicant' ? 'text-primary' : 'text-gray-400'}`} />
              <p className={`text-sm font-semibold ${role === 'applicant' ? 'text-primary' : 'text-gray-600'}`}>Applicant</p>
              <p className="text-xs text-gray-400 mt-1">Seeking support to marry</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('sponsor')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === 'sponsor'
                  ? 'border-secondary bg-gold-light'
                  : 'border-gray-200 hover:border-secondary/50'
              }`}
            >
              <HandHeart className={`h-6 w-6 mx-auto mb-1 ${role === 'sponsor' ? 'text-secondary' : 'text-gray-400'}`} />
              <p className={`text-sm font-semibold ${role === 'sponsor' ? 'text-secondary-dark' : 'text-gray-600'}`}>Sponsor</p>
              <p className="text-xs text-gray-400 mt-1">Wanting to help couples</p>
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Create Account <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
      </p>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
