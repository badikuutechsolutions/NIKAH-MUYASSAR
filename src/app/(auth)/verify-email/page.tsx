'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <MailCheck className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-2">Check Your Email</h1>
      <p className="text-gray-500 mb-6">
        We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
      </p>
      <div className="space-y-3">
        <Link href="/login">
          <Button variant="primary">Go to Sign In</Button>
        </Link>
        <p className="text-sm text-gray-400">
          Didn't receive the email?{' '}
          <button onClick={() => {}} className="text-primary hover:underline">Resend</button>
        </p>
      </div>
    </motion.div>
  )
}
