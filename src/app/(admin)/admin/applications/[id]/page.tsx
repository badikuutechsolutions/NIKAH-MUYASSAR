'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate, getCountryFlag } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminApplicationDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reviewerNotes, setReviewerNotes] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchApp = async () => {
      const { data } = await supabase.from('applications').select('*').eq('id', params.id).single()
      setApplication(data)
      setReviewerNotes(data?.reviewer_notes || '')
      setStatus(data?.status || '')
      setLoading(false)
    }
    fetchApp()
  }, [params.id])

  const handleSave = async () => {
      const { error } = await supabase
        .from('applications')
        .update({ status, reviewer_notes: reviewerNotes, reviewed_at: new Date().toISOString() })
        .eq('id', params.id)
    if (error) { toast.error('Failed to update'); return }
    toast.success('Application updated')
    router.refresh()
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-96 w-full" /></div>
  if (!application) return <div className="text-center py-12"><p className="text-gray-500">Application not found.</p></div>

  return (
    <div className="space-y-6">
      <Link href="/admin/applications" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back</Link>

      <Card><CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-charcoal">
              {application.display_alias || application.full_name}
            </h1>
            <p className="text-gray-500">{getCountryFlag(application.country_of_residence)} {application.country_of_residence}, {application.city}</p>
          </div>
          <Badge variant="status" status={application.status} size="md">{application.status}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-gray-500">Age:</span> {application.age}</div>
          <div><span className="text-gray-500">Gender:</span> <span className="capitalize">{application.gender}</span></div>
          <div><span className="text-gray-500">Marital Status:</span> <span className="capitalize">{application.marital_status}</span></div>
          <div><span className="text-gray-500">Nationality:</span> {application.nationality}</div>
          <div><span className="text-gray-500">Amount Requested:</span> KSh {application.amount_requested}</div>
          <div><span className="text-gray-500">Amount Raised:</span> KSh {application.amount_raised}</div>
          <div><span className="text-gray-500">Mosque:</span> {application.local_mosque_name}</div>
          <div><span className="text-gray-500">Imam:</span> {application.imam_reference_name}</div>
          <div><span className="text-gray-500">Submitted:</span> {formatDate(application.submitted_at)}</div>
        </div>

        <div><h3 className="font-semibold text-charcoal mb-2">Financial Hardship</h3><p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{application.financial_hardship_desc}</p></div>
        <div><h3 className="font-semibold text-charcoal mb-2">Reason for Marriage</h3><p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{application.reason_for_marriage}</p></div>

        <div><h3 className="font-semibold text-charcoal mb-2">Documents</h3>
          <div className="flex gap-3">
            {application.id_document_url && <a href={application.id_document_url} target="_blank" className="text-primary hover:underline text-sm flex items-center gap-1">ID Document <ExternalLink className="h-3 w-3" /></a>}
            {application.income_proof_url && <a href={application.income_proof_url} target="_blank" className="text-primary hover:underline text-sm flex items-center gap-1">Income Proof <ExternalLink className="h-3 w-3" /></a>}
            {application.imam_letter_url && <a href={application.imam_letter_url} target="_blank" className="text-primary hover:underline text-sm flex items-center gap-1">Imam Letter <ExternalLink className="h-3 w-3" /></a>}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="font-semibold text-charcoal">Admin Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Update Status" options={[
              { value: 'under_review', label: 'Under Review' },
              { value: 'info_requested', label: 'Info Requested' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'withdrawn', label: 'Withdrawn' },
            ]} value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <Textarea label="Reviewer Notes" placeholder="Add notes about this application..." value={reviewerNotes} onChange={(e: any) => setReviewerNotes(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleSave}><CheckCircle className="h-4 w-4" /> Save Changes</Button>
            {status === 'approved' && (
              <Link href={`/admin/meetings?application_id=${params.id}`}>
                <Button variant="outline"><MessageSquare className="h-4 w-4" /> Schedule Meeting</Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent></Card>
    </div>
  )
}
