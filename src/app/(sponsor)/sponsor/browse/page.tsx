'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, SlidersHorizontal, X, ArrowRight, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { getCountryFlag, formatRelativeDate } from '@/lib/utils'
import { COUNTRIES } from '@/lib/constants'
import { toast } from 'sonner'

export default function SponsorBrowsePage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      let query = supabase
        .from('applications')
        .select('*')
        .in('status', ['pending', 'under_review', 'approved', 'sponsored', 'partially_funded', 'fully_funded'])
        .order('submitted_at', { ascending: false })

      if (countryFilter) query = query.eq('country_of_residence', countryFilter)
      if (genderFilter) query = query.eq('gender', genderFilter)
      if (urgencyFilter) query = query.eq('urgency_level', urgencyFilter)

      const { data } = await query
      setApplications(data || [])
      setLoading(false)
    }
    fetchApplications()
  }, [countryFilter, genderFilter, urgencyFilter])

  const filtered = applications
    .filter((app) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (app.display_alias || app.full_name)?.toLowerCase().includes(q) ||
        app.country_of_residence?.toLowerCase().includes(q) ||
        app.city?.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      if (sortBy === 'amount_high') return (b.amount_requested - b.amount_raised) - (a.amount_requested - a.amount_raised)
      if (sortBy === 'amount_low') return (a.amount_requested - a.amount_raised) - (b.amount_requested - b.amount_raised)
      return 0
    })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-charcoal">Support a Marriage</h1>
        <p className="text-gray-500">Earn Sadaqah Jariyah by helping a couple complete half their Deen</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Input type="text" placeholder="Search by country, alias, or city..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} icon={<SlidersHorizontal className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-white rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-charcoal flex items-center gap-1"><Filter className="h-4 w-4" /> Filters</h3>
            <button onClick={() => { setCountryFilter(''); setGenderFilter(''); setUrgencyFilter('') }} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select options={[{ value: '', label: 'All Countries' }, ...COUNTRIES.map(c => ({ value: c, label: c }))]} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} />
            <Select options={[{ value: '', label: 'All Genders' }, { value: 'male', label: 'Brothers' }, { value: 'female', label: 'Sisters' }]} value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} />
            <Select options={[{ value: '', label: 'All Urgency' }, { value: 'low', label: 'Low' }, { value: 'normal', label: 'Normal' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <Select options={[{ value: 'newest', label: 'Newest First' }, { value: 'amount_high', label: 'Most Needed' }, { value: 'amount_low', label: 'Least Needed' }]} value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
          </div>
        </motion.div>
      )}

      {/* Applications Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No applications found matching your criteria.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setCountryFilter(''); setGenderFilter(''); setUrgencyFilter('') }} className="mt-2">Clear Filters</Button>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app, i) => {
            const percentage = Math.min(Math.round((app.amount_raised / app.amount_requested) * 100), 100)
            const alias = app.display_alias || `Anonymous (${app.country_of_residence})`
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getCountryFlag(app.country_of_residence)}</span>
                      <div>
                        <h3 className="font-semibold text-charcoal text-sm">{alias}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{app.country_of_residence}, {app.city}</span>
                          <Badge variant="default" size="sm" className="capitalize">{app.gender === 'male' ? 'Brother' : 'Sister'}</Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                      "{app.financial_hardship_desc?.slice(0, 100)}..."
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Goal: KSh ${app.amount_requested}</span>
                        <span className="text-primary font-semibold">Raised: KSh ${app.amount_raised}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span>{formatRelativeDate(app.submitted_at)}</span>
                      {app.urgency_level === 'high' || app.urgency_level === 'critical' ? (
                        <Badge variant="default" size="sm" className="bg-red-100 text-red-700">{app.urgency_level}</Badge>
                      ) : null}
                    </div>

                    <Link href={`/sponsor/application/${app.id}`}>
                      <Button variant="primary" size="sm" className="w-full" icon={<ArrowRight className="h-3 w-3" />}>View Full Story</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
