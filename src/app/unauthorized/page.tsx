'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleSignIn = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">&#x1F6AB;</div>
        <h1 className="text-2xl font-display font-bold text-charcoal mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">You do not have permission to access this page. Please sign in with the appropriate account type.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={handleSignIn}>
            Sign In
          </Button>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
