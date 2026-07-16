'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function AdminSponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('sponsorships').select('*').order('pledged_at', { ascending: false }).then(({ data }) => {
      setSponsorships(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">All Sponsorships</h1>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Sponsor</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Application</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((s: any) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-charcoal">{s.sponsor_id?.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-gray-500">{s.application_id?.slice(0, 8)}...</td>
                  <td className="py-3 px-4 font-medium">${s.amount_pledged} {s.currency}</td>
                  <td className="py-3 px-4"><Badge variant="status" status={s.status === 'completed' ? 'approved' : s.status === 'pledged' ? 'pending' : 'withdrawn'}>{s.status}</Badge></td>
                  <td className="py-3 px-4 text-xs text-gray-400">{formatDate(s.pledged_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  )
}
