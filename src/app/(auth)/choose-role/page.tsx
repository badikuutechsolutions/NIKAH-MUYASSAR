'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, HandHeart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArabicText } from '@/components/ui/arabic-text'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ChooseRolePage() {
  const [role, setRole] = useState<'applicant' | 'sponsor' | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!role) { toast.error('Please select a role'); return }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.auth.updateUser({
      data: { role },
    })

    if (error) { toast.error(error.message); setLoading(false); return }

    // Also update the profiles table
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      role,
    })

    const redirects: Record<string, string> = {
      applicant: '/dashboard',
      sponsor: '/sponsor/dashboard',
    }
    router.push(redirects[role])
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <ArabicText text="نكاح ميسر" size="lg" className="text-primary mb-4" />
        <h1 className="text-2xl font-display font-bold text-charcoal mb-2">
          Welcome! Choose Your Role
        </h1>
        <p className="text-gray-500 mb-8">How would you like to join the platform?</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setRole('applicant')}
            className={`p-6 rounded-xl border-2 text-center transition-all ${
              role === 'applicant'
                ? 'border-primary bg-light-teal'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <Heart className={`h-8 w-8 mx-auto mb-2 ${role === 'applicant' ? 'text-primary' : 'text-gray-400'}`} />
            <p className={`font-semibold ${role === 'applicant' ? 'text-primary' : 'text-gray-600'}`}>Applicant</p>
            <p className="text-xs text-gray-400 mt-1">Seeking support to marry</p>
          </button>
          <button
            onClick={() => setRole('sponsor')}
            className={`p-6 rounded-xl border-2 text-center transition-all ${
              role === 'sponsor'
                ? 'border-secondary bg-gold-light'
                : 'border-gray-200 hover:border-secondary/50'
            }`}
          >
            <HandHeart className={`h-8 w-8 mx-auto mb-2 ${role === 'sponsor' ? 'text-secondary' : 'text-gray-400'}`} />
            <p className={`font-semibold ${role === 'sponsor' ? 'text-secondary-dark' : 'text-gray-600'}`}>Sponsor</p>
            <p className="text-xs text-gray-400 mt-1">Wanting to help couples</p>
          </button>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          loading={loading}
          disabled={!role}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  )
}
