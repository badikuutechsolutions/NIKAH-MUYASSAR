'use client'

import { useState, useEffect } from 'react'
import { Search, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const changeRole = async (userId: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) { toast.error('Failed to update role'); return }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
    toast.success('Role updated')
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.country?.toLowerCase().includes(q)
  })

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Users</h1>
      <div className="mb-4"><Input type="text" placeholder="Search users..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Country</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-charcoal">{u.full_name}</td>
                  <td className="py-3 px-4 text-gray-500">{u.email}</td>
                  <td className="py-3 px-4"><Badge variant="role">{u.role}</Badge></td>
                  <td className="py-3 px-4 text-gray-500">{u.country || '-'}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(u.created_at)}</td>
                  <td className="py-3 px-4">
                    <Select options={[
                      { value: 'applicant', label: 'Applicant' },
                      { value: 'sponsor', label: 'Sponsor' },
                      { value: 'reviewer', label: 'Reviewer' },
                      { value: 'admin', label: 'Admin' },
                    ]} value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  )
}
