'use client'

import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/hooks'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const { user } = useUser()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('applications').select('*').eq('applicant_id', user.id).order('submitted_at', { ascending: false }).limit(1).single().then(({ data }) => {
      setApplication(data)
      setLoading(false)
    })
  }, [user])

  if (loading) return <Skeleton className="h-64 w-full" />

  const docs = [
    { label: 'ID Document', url: application?.id_document_url, key: 'id_document_url' },
    { label: 'Income Proof', url: application?.income_proof_url, key: 'income_proof_url' },
    { label: 'Imam Letter', url: application?.imam_letter_url, key: 'imam_letter_url' },
    { label: 'Profile Photo', url: application?.profile_photo_url, key: 'profile_photo_url' },
  ]

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="text-2xl font-display font-bold text-charcoal">Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <Card key={doc.key}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.url ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Upload className="h-5 w-5 text-gray-400" />}
                  <div>
                    <p className="font-medium text-charcoal">{doc.label}</p>
                    <p className="text-xs text-gray-400">{doc.url ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                </div>
                {doc.url && <a href={doc.url} target="_blank" className="text-primary hover:underline text-sm flex items-center gap-1"><ExternalLink className="h-3 w-3" /> View</a>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-gray-400">To update documents, please re-submit your application or contact support.</p>
    </div>
  )
}
