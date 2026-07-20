'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, ShieldAlert, User, Heart, Eye, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Modal } from '@/components/ui/modal'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: 'Admin', icon: Shield, color: 'bg-purple-100 text-purple-800' },
  reviewer: { label: 'Reviewer', icon: Eye, color: 'bg-blue-100 text-blue-800' },
  sponsor: { label: 'Sponsor', icon: Heart, color: 'bg-secondary/10 text-secondary-dark' },
  applicant: { label: 'Applicant', icon: User, color: 'bg-light-teal text-primary' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmModal, setConfirmModal] = useState<{ user: any; newRole: string } | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const changeRole = async (userId: string, newRole: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update role')
      }
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
      toast.success(`User promoted to ${newRole}`)
    } catch (err: any) {
      toast.error(err.message)
    }
    setUpdating(false)
    setConfirmModal(null)
  }

  const handleRoleChange = (user: any, newRole: string) => {
    if (newRole === 'admin') {
      setConfirmModal({ user, newRole })
    } else {
      changeRole(user.id, newRole)
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.country?.toLowerCase().includes(q)
  })

  const adminCount = users.filter((u) => u.role === 'admin').length

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal">Users</h1>
          <p className="text-sm text-gray-500">{users.length} total &middot; {adminCount} admin</p>
        </div>
      </div>
      <div className="mb-4"><Input type="text" placeholder="Search by name, email, or country..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Country</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const config = ROLE_CONFIG[u.role] || ROLE_CONFIG.applicant
                const Icon = config.icon
                return (
                  <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">
                            {u.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{u.full_name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        <Icon className="h-3 w-3" /> {config.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{u.country || '-'}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(u.created_at)}</td>
                    <td className="py-3 px-4">
                      <Select options={[
                        { value: 'applicant', label: 'Applicant' },
                        { value: 'sponsor', label: 'Sponsor' },
                        { value: 'reviewer', label: 'Reviewer' },
                        { value: 'admin', label: 'Admin' },
                      ]} value={u.role} onChange={(e) => handleRoleChange(u, e.target.value)} />
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent></Card>

      {/* Confirm admin promotion */}
      <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title="Promote to Admin?" size="sm">
        <div className="p-6 text-center">
          <ShieldAlert className="h-12 w-12 text-secondary mx-auto mb-4" />
          <p className="text-charcoal font-semibold mb-2">
            Promote {confirmModal?.user?.full_name} to <strong>Admin</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Admins have full access to all platform data, settings, and user management. Only promote trusted users.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setConfirmModal(null)}>Cancel</Button>
            <Button variant="primary" className="flex-1" loading={updating} onClick={() => confirmModal && changeRole(confirmModal.user.id, 'admin')}>
              Promote to Admin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
