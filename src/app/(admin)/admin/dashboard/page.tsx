'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, Heart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    total_applications: 0, pending: 0, approved: 0, completed: 0,
    total_sponsors: 0, total_amount_raised: 0, countries_count: 0,
  })
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: apps } = await supabase.from('applications').select('*').order('submitted_at', { ascending: false })
      const { data: sponsors } = await supabase.from('profiles').select('*').eq('role', 'sponsor')
      const { data: statsRow } = await supabase.from('platform_stats').select('*').single()

      const allApps = apps || []
      setApplications(allApps.slice(0, 10))
      setStats({
        total_applications: allApps.length,
        pending: allApps.filter((a) => a.status === 'pending').length,
        under_review: allApps.filter((a) => a.status === 'under_review').length,
        approved: allApps.filter((a) => a.status === 'approved').length,
        completed: allApps.filter((a) => a.status === 'completed').length,
        total_sponsors: sponsors?.length || 0,
        total_amount_raised: allApps.reduce((sum, a) => sum + Number(a.amount_raised), 0),
        countries_count: new Set(allApps.map((a) => a.country_of_residence)).size,
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  const KPIs = [
    { label: 'Total Applications', value: stats.total_applications.toString(), icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending Review', value: stats.pending.toString(), icon: FileText, color: 'bg-amber-500' },
    { label: 'Approved', value: stats.approved.toString(), icon: Heart, color: 'bg-green-500' },
    { label: 'Completed (Marriages)', value: stats.completed.toString(), icon: Heart, color: 'bg-emerald-500' },
    { label: 'Total Sponsors', value: stats.total_sponsors.toString(), icon: Users, color: 'bg-purple-500' },
    { label: 'Funds Raised', value: `$${stats.total_amount_raised.toLocaleString()}`, icon: DollarSign, color: 'bg-secondary' },
  ]

  if (loading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-charcoal">Admin Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPIs.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card><CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-lg ${kpi.color} bg-opacity-20 flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-4 w-4 ${kpi.color.replace('bg-', 'text-')}`} />
                </div>
                <p className="text-xl font-bold text-charcoal font-display">{kpi.value}</p>
                <p className="text-xs text-gray-500">{kpi.label}</p>
              </CardContent></Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Applications */}
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-display font-bold text-charcoal mb-4">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Applicant</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Country</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-charcoal">{app.display_alias || app.full_name?.split(' ')[0]}</td>
                    <td className="py-3 px-2 text-gray-500">{app.country_of_residence}</td>
                    <td className="py-3 px-2">${app.amount_requested}</td>
                    <td className="py-3 px-2">
                      <Badge variant="status" status={app.status} size="sm">{app.status}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <a href={`/admin/applications/${app.id}`} className="text-primary hover:underline text-xs">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/admin/applications', label: 'All Applications', icon: FileText },
          { href: '/admin/users', label: 'Manage Users', icon: Users },
          { href: '/admin/faqs', label: 'Manage FAQs', icon: FileText },
          { href: '/admin/settings', label: 'Platform Settings', icon: FileText },
        ].map((link) => (
          <a key={link.href} href={link.href}>
            <Card hover><CardContent className="p-4 text-center">
              <link.icon className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium text-charcoal">{link.label}</p>
            </CardContent></Card>
          </a>
        ))}
      </div>
    </div>
  )
}
