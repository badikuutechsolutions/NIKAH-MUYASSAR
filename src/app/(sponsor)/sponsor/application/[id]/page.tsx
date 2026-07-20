'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, DollarSign, Lock, Check, Phone, Copy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Modal } from '@/components/ui/modal'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { getCountryFlag, formatRelativeDate } from '@/lib/utils'
import { CURRENCIES } from '@/lib/constants'
import { toast } from 'sonner'

export default function SponsorApplicationDetail({ params }: { params: { id: string } }) {
  const { user } = useUser()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPledge, setShowPledge] = useState(false)
  const [pledgeAmount, setPledgeAmount] = useState('')
  const [pledgeCurrency, setPledgeCurrency] = useState('KES')
  const [pledgeMessage, setPledgeMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isZakat, setIsZakat] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pledgeSuccess, setPledgeSuccess] = useState<any>(null)

  useEffect(() => {
    const fetchApp = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single()
      setApplication(data)
      setLoading(false)
    }
    fetchApp()
  }, [params.id])

  const handlePledge = async () => {
    if (!pledgeAmount || parseFloat(pledgeAmount) <= 0) { toast.error('Please enter a valid amount'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: params.id,
          amount_pledged: parseFloat(pledgeAmount),
          currency: pledgeCurrency,
          sponsor_message: pledgeMessage || undefined,
          is_anonymous: isAnonymous,
          is_zakat: isZakat,
        }),
      })
      if (!res.ok) throw new Error('Failed to create pledge')
      const pledge = await res.json()
      setPledgeSuccess(pledge)
      setShowPledge(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create pledge')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-64 w-full" /></div>
  if (!application) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Application not found or no longer available.</p>
      <Link href="/sponsor/browse"><Button variant="primary" className="mt-4">Browse Applications</Button></Link>
    </div>
  )

  const alias = application.display_alias || `Resident of ${application.country_of_residence}`
  const percentage = Math.min(Math.round((application.amount_raised / application.amount_requested) * 100), 100)

  return (
    <div className="space-y-6">
      <Link href="/sponsor/browse" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Browse
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(application.country_of_residence)}</span>
              <div>
                <h1 className="text-2xl font-display font-bold text-charcoal">{alias}</h1>
                <p className="text-sm text-gray-400">{application.country_of_residence}, {application.city} · {application.gender === 'male' ? 'Brother' : 'Sister'}</p>
              </div>
            </div>
            <Badge variant="status" status={application.status}>{application.status}</Badge>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Goal: ${application.amount_requested}</span>
              <span className="text-primary font-semibold">Raised: ${application.amount_raised} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">About Their Situation</h3>
              <p className="text-gray-600 leading-relaxed">{application.financial_hardship_desc}</p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Why They Want to Marry</h3>
              <p className="text-gray-600 leading-relaxed">{application.reason_for_marriage}</p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Community Reference</h3>
              <p className="text-gray-600">{application.local_mosque_name}, {application.local_mosque_city} · Imam: {application.imam_reference_name}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="secondary" size="lg" className="w-full" onClick={() => setShowPledge(true)} icon={<Heart className="h-5 w-5" />}>
              Sponsor This Marriage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pledge Success - Payment Instructions */}
      {pledgeSuccess && (
        <Card className="border-secondary/30 bg-gradient-to-br from-gold-light to-white">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-charcoal mb-2">Jazakallah Khair!</h2>
            <p className="text-gray-600 mb-4">Your pledge of <strong>KSh {pledgeSuccess.amount_pledged}</strong> has been recorded.</p>
            <div className="bg-white rounded-xl p-5 text-left space-y-3 border border-gray-200 mb-4">
              <h3 className="font-semibold text-charcoal text-center">Next Steps — Make Your Payment</h3>
              <div className="flex items-center gap-3 p-3 bg-light-teal rounded-lg">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Send via M-Pesa to:</p>
                  <p className="text-lg font-bold text-primary">+254 742 773 562</p>
                  <p className="text-xs text-gray-500">Hamoudy Badi</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText('254742773562'); toast.success('Number copied!') }} className="ml-auto p-2 rounded-lg hover:bg-gray-100">
                  <Copy className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>After sending, forward the M-Pesa confirmation message to <strong>+254 742 773 562</strong> via WhatsApp or SMS. Your pledge will be confirmed by our team within 24 hours.</p>
              </div>
            </div>
            <Link href="/sponsor/my-sponsorships">
              <Button variant="primary">View My Sponsorships</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pledge Modal */}
      <Modal isOpen={showPledge} onClose={() => setShowPledge(false)} title="Make a Sponsorship Pledge" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pledge Amount *" type="number" placeholder="e.g., 500" value={pledgeAmount} onChange={(e) => setPledgeAmount(e.target.value)} />
            <Select label="Currency" options={CURRENCIES.map(c => ({ value: c.code, label: `${c.code} (${c.symbol})` }))} value={pledgeCurrency} onChange={(e) => setPledgeCurrency(e.target.value)} />
          </div>
          <Textarea label="Personal Message (Optional)" placeholder="Write a message to the couple..." value={pledgeMessage} onChange={(e: any) => setPledgeMessage(e.target.value)} />
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
              <div><p className="text-sm font-medium text-charcoal">Sponsor anonymously</p><p className="text-xs text-gray-500">Your name will not be shared with the couple</p></div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={isZakat} onChange={(e) => setIsZakat(e.target.checked)} className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
              <div><p className="text-sm font-medium text-charcoal">This is Zakat</p><p className="text-xs text-gray-500">Mark if you intend this as Zakat al-Mal</p></div>
            </label>
          </div>
          <Button variant="secondary" className="w-full" onClick={handlePledge} loading={submitting} icon={<Heart className="h-4 w-4" />}>
            Confirm Pledge — KSh {pledgeAmount || '0'} {pledgeCurrency}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
