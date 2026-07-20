'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Search, CreditCard, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/hooks'
import { DUA_FOR_MARRIAGE } from '@/lib/constants'
import { ArabicText } from '@/components/ui/arabic-text'

export default function SponsorDashboard() {
  const { user, profile } = useUser()
  const [stats, setStats] = useState({ total: 0, pledged: 0, paid: 0 })
  const [loading, setLoading] = useState(true)
  const [sponsorships, setSponsorships] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const { data } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('sponsor_id', user.id)
      const sp = data || []
      setSponsorships(sp)
      setStats({
        total: sp.length,
        pledged: sp.reduce((sum, s) => sum + Number(s.amount_pledged), 0),
        paid: sp.filter((s) => s.status === 'completed').reduce((sum, s) => sum + Number(s.amount_paid), 0),
      })
      setLoading(false)
    }
    fetchData()
  }, [user])

  if (loading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-48 w-full" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-charcoal">
          Assalamu Alaikum, {profile?.full_name?.split(' ')[0] || 'Sponsor'}
        </h1>
        <p className="text-gray-500">Your sponsorship impact at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 text-center">
          <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-charcoal font-display">{stats.total}</p>
          <p className="text-sm text-gray-500">Sponsorships Made</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-charcoal font-display">KSh ${stats.pledged.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Pledged</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
          <p className="text-2xl font-bold text-charcoal font-display">KSh ${stats.paid.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Paid</p>
        </CardContent></Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/sponsor/browse">
          <Card hover><CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="h-8 w-8 text-primary" />
              <div><h3 className="font-semibold text-charcoal">Browse Applications</h3><p className="text-sm text-gray-500">Find couples to sponsor</p></div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent></Card>
        </Link>
        <Link href="/sponsor/my-sponsorships">
          <Card hover><CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-accent" />
              <div><h3 className="font-semibold text-charcoal">My Sponsorships</h3><p className="text-sm text-gray-500">View your impact</p></div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent></Card>
        </Link>
      </div>

      {/* Recent sponsorships */}
      {sponsorships.length > 0 && (
        <Card><CardContent className="p-5">
          <h3 className="font-semibold text-charcoal mb-3">Recent Sponsorships</h3>
          <div className="space-y-2">
            {sponsorships.slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-charcoal">KSh ${s.amount_pledged} pledged</p>
                  <p className="text-xs text-gray-400">{s.currency} &middot; {s.status}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'completed' ? 'bg-green-100 text-green-700' : s.status === 'pledged' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}

      {/* Du'a */}
      <Card className="bg-gradient-to-br from-gold-light to-white border-secondary/20">
        <CardContent className="p-5 text-center">
          <ArabicText text={DUA_FOR_MARRIAGE.arabic} size="md" className="text-primary mb-2" />
          <p className="text-xs text-gray-500 italic">{DUA_FOR_MARRIAGE.translation}</p>
        </CardContent>
      </Card>
    </div>
  )
}
