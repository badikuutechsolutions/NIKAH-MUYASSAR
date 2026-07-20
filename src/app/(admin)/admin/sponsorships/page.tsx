'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Heart } from 'lucide-react'

export default function AdminSponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [profileMap, setProfileMap] = useState<Record<string, any>>({})
  const [appMap, setAppMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: spData } = await supabase
        .from('sponsorships')
        .select('*')
        .order('pledged_at', { ascending: false })

      if (!spData) { setLoading(false); return }

      // Collect all sponsor and application IDs
      const sponsorIds = Array.from(new Set(spData.map((s: any) => s.sponsor_id)))
      const appIds = Array.from(new Set(spData.map((s: any) => s.application_id)))

      // Fetch profile names
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', sponsorIds)

      // Fetch application names
      const { data: apps } = await supabase
        .from('applications')
        .select('id, full_name')
        .in('id', appIds)

      const pMap: Record<string, any> = {}
      profiles?.forEach((p) => { pMap[p.id] = p })
      const aMap: Record<string, any> = {}
      apps?.forEach((a) => { aMap[a.id] = a })

      setProfileMap(pMap)
      setAppMap(aMap)
      setSponsorships(spData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">All Sponsorships</h1>

      {sponsorships.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-1">No sponsorships yet</p>
          <p className="text-sm">Sponsorships will appear here once sponsors make pledges</p>
        </div>
      ) : (
        <Card><CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Sponsor</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Applicant</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {sponsorships.map((s: any) => {
                  const sponsor = profileMap[s.sponsor_id]
                  const applicant = appMap[s.application_id]
                  return (
                    <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-bold">
                              {sponsor?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                            </span>
                          </div>
                          <span className="font-medium text-charcoal">{sponsor?.full_name || s.sponsor_id?.slice(0, 8) + '...'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{applicant?.full_name || s.application_id?.slice(0, 8) + '...'}</td>
                      <td className="py-3 px-4 font-medium">KSh {s.amount_pledged} {s.currency}</td>
                      <td className="py-3 px-4">
                        <Badge variant="status" status={s.status === 'completed' ? 'approved' : s.status === 'pledged' ? 'pending' : 'rejected'}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-400">{formatDate(s.pledged_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent></Card>
      )}
    </div>
  )
}
