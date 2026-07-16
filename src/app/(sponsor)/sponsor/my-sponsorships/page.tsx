'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { formatDate } from '@/lib/utils'

export default function MySponsorshipsPage() {
  const { user } = useUser()
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchSponsorships = async () => {
      const { data } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('sponsor_id', user.id)
        .order('pledged_at', { ascending: false })
      setSponsorships(data || [])
      setLoading(false)
    }
    fetchSponsorships()
  }, [user])

  if (loading) return <div className="space-y-4"><Skeleton className="h-48 w-full" /></div>

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">My Sponsorships</h1>

      {sponsorships.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">You haven&apos;t made any sponsorships yet.</p>
          <p className="text-sm text-gray-400">Browse applications and be the reason two hearts unite.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {sponsorships.map((s: any, i: number) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {s.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Clock className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          ${s.amount_pledged} {s.currency} pledged
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(s.pledged_at)}</p>
                        {s.sponsor_message && <p className="text-xs text-gray-500 mt-1 italic">&ldquo;{s.sponsor_message}&rdquo;</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="status" status={s.status === 'completed' ? 'approved' : s.status === 'pledged' ? 'under_review' : 'pending'}>
                        {s.status}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">${s.amount_paid} paid</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    {s.is_zakat && <Badge variant="default" size="sm" className="bg-green-100 text-green-700">Zakat</Badge>}
                    {s.is_anonymous && <Badge variant="default" size="sm" className="bg-gray-100 text-gray-600">Anonymous</Badge>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Card className="bg-gradient-to-br from-secondary/10 to-gold-light border-secondary/20">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-gray-600 font-quote italic">
                "A dinar you spend in the way of Allah... the greatest of these in reward is the one you spend on your family."
              </p>
              <p className="text-xs text-gray-400 mt-1">Sahih Muslim, no. 995</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
