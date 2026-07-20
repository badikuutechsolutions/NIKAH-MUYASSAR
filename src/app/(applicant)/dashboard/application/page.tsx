'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { formatDate, getCountryFlag } from '@/lib/utils'

export default function ApplicationDetail() {
  const { user } = useUser()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchApplication = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('applicant_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()
      setApplication(data)
      setLoading(false)
    }
    fetchApplication()
  }, [user])

  if (loading) return <div className="space-y-4"><Skeleton className="h-64 w-full" /></div>
  if (!application) return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">You haven't submitted an application yet.</p>
      <Link href="/apply"><Button variant="primary">Apply Now</Button></Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-display font-bold text-charcoal mb-1">Your Application</h2>
            <Badge variant="status" status={application.status} size="md">{application.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal text-base">Personal Details</h3>
              <div className="space-y-2">
                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{application.full_name}</span></div>
                <div><span className="text-gray-500">Age:</span> <span className="font-medium">{application.age}</span></div>
                <div><span className="text-gray-500">Gender:</span> <span className="font-medium capitalize">{application.gender}</span></div>
                <div><span className="text-gray-500">Marital Status:</span> <span className="font-medium capitalize">{application.marital_status}</span></div>
                <div><span className="text-gray-500">Nationality:</span> <span className="font-medium">{getCountryFlag(application.nationality)} {application.nationality}</span></div>
                <div><span className="text-gray-500">Residence:</span> <span className="font-medium">{getCountryFlag(application.country_of_residence)} {application.country_of_residence}, {application.city}</span></div>
                <div><span className="text-gray-500">Occupation:</span> <span className="font-medium">{application.occupation || 'Not specified'}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal text-base">Financial Details</h3>
              <div className="space-y-2">
                <div><span className="text-gray-500">Monthly Income:</span> <span className="font-medium">{application.monthly_income ? `$${application.monthly_income}` : 'Not specified'}</span></div>
                <div><span className="text-gray-500">Employment:</span> <span className="font-medium capitalize">{application.employment_type || 'Not specified'}</span></div>
                <div><span className="text-gray-500">Amount Requested:</span> <span className="font-bold text-primary">KSh ${application.amount_requested}</span></div>
                <div><span className="text-gray-500">Amount Raised:</span> <span className="font-bold text-green-600">KSh ${application.amount_raised}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal text-base">Islamic Background</h3>
              <div className="space-y-2">
                <div><span className="text-gray-500">Practice Level:</span> <span className="font-medium capitalize">{application.religiosity_level}</span></div>
                <div><span className="text-gray-500">Mosque:</span> <span className="font-medium">{application.local_mosque_name}, {application.local_mosque_city}</span></div>
                <div><span className="text-gray-500">Imam:</span> <span className="font-medium">{application.imam_reference_name}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal text-base">Documents</h3>
              <div className="space-y-2">
                <div><span className="text-gray-500">ID Document:</span> {application.id_document_url ? <a href={application.id_document_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">View <ExternalLink className="h-3 w-3" /></a> : <span className="text-red-500">Not uploaded</span>}</div>
                <div><span className="text-gray-500">Income Proof:</span> {application.income_proof_url ? <a href={application.income_proof_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">View <ExternalLink className="h-3 w-3" /></a> : <span className="text-red-500">Not uploaded</span>}</div>
                <div><span className="text-gray-500">Imam Letter:</span> {application.imam_letter_url ? <a href={application.imam_letter_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">View <ExternalLink className="h-3 w-3" /></a> : <span className="text-red-500">Not uploaded</span>}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal mb-2">Financial Hardship Description</h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{application.financial_hardship_desc}</p>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Reason for Marriage</h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{application.reason_for_marriage}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
