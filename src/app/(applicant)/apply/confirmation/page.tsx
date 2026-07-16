import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ApplyConfirmationPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-charcoal mb-3">Application Submitted!</h1>
        <p className="text-gray-500 mb-2">Jazakallah Khair for your submission.</p>
        <p className="text-gray-500 mb-6">Please go to your dashboard to track your application status.</p>
        <Link href="/dashboard"><Button variant="primary">Go to Dashboard</Button></Link>
      </div>
    </div>
  )
}
