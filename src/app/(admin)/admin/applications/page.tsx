'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Eye, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatRelativeDate, getCountryFlag } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')

  useEffect(() => {
    const fetchApps = async () => {
      let query = supabase.from('applications').select('*').order('submitted_at', { ascending: false })
      if (statusFilter) query = query.eq('status', statusFilter)
      const { data } = await query
      setApplications(data || [])
      setLoading(false)
    }
    fetchApps()
  }, [statusFilter])

  const filtered = applications.filter((app) => {
    if (search) {
      const q = search.toLowerCase()
      const name = app.display_alias || app.full_name || ''
      if (!name.toLowerCase().includes(q) && !app.country_of_residence?.toLowerCase().includes(q) && !app.city?.toLowerCase().includes(q)) return false
    }
    if (countryFilter && app.country_of_residence !== countryFilter) return false
    return true
  })

  const handleStatusUpdate = async (id: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', id)
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-96 w-full" /></div>

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Applications</h1>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input type="text" placeholder="Search applications..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select options={STATUS_OPTIONS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Applicant</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Country</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Submitted</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{getCountryFlag(app.country_of_residence)}</span>
                        <span className="font-medium text-charcoal">{app.display_alias || app.full_name?.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{app.country_of_residence}</td>
                    <td className="py-3 px-4 font-medium">${app.amount_requested}</td>
                    <td className="py-3 px-4"><Badge variant="status" status={app.status} size="sm">{app.status}</Badge></td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatRelativeDate(app.submitted_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/applications/${app.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        {app.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(app.id, 'under_review')} className="text-blue-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(app.id, 'rejected')} className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {app.status === 'under_review' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(app.id, 'approved')} className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(app.id, 'rejected')} className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">No applications found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
