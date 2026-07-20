'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, Upload, Calendar, Bell, User, Users,
  Heart, Search, CreditCard, BookOpen, MessageSquare, Settings,
  ChevronLeft, Menu, LogOut, Award,
} from 'lucide-react'
import { ToastProvider } from '@/components/ui/toast'
import { useUser } from '@/lib/hooks'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'applicant' | 'sponsor' | 'admin'
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { profile } = useUser()

  const applicantLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/application', label: 'My Application', icon: FileText },
    { href: '/dashboard/documents', label: 'Documents', icon: Upload },
    { href: '/dashboard/meetings', label: 'Meetings', icon: Calendar },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ]

  const sponsorLinks = [
    { href: '/sponsor/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/sponsor/browse', label: 'Browse Applications', icon: Search },
    { href: '/sponsor/my-sponsorships', label: 'My Sponsorships', icon: Heart },
    { href: '/sponsor/notifications', label: 'Notifications', icon: Bell },
    { href: '/sponsor/profile', label: 'Profile', icon: User },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Analytics', icon: LayoutDashboard },
    { href: '/admin/applications', label: 'Applications', icon: FileText },
    { href: '/admin/sponsorships', label: 'Sponsorships', icon: CreditCard },
    { href: '/admin/meetings', label: 'Meetings', icon: Calendar },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/success-stories', label: 'Success Stories', icon: Award },
    { href: '/admin/faqs', label: 'FAQs', icon: BookOpen },
    { href: '/admin/contact-messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const links = role === 'applicant' ? applicantLinks : role === 'sponsor' ? sponsorLinks : adminLinks

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastProvider />
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-charcoal text-white transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        )}
      >
        <div className={cn('flex items-center h-16 px-4 border-b border-white/10', !sidebarOpen && 'lg:justify-center')}>
          <Link href="/" className={cn('flex items-center gap-2', !sidebarOpen && 'lg:hidden')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">NM</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-display text-sm font-bold">Nikah Muyassar</p>
                <p className="font-arabic text-[10px] text-secondary">{'نكاح ميسر'}</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10',
                  !sidebarOpen && 'lg:justify-center lg:px-2'
                )}
                title={!sidebarOpen ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={async () => {
              const { supabase } = await import('@/lib/supabase')
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors w-full',
              !sidebarOpen && 'lg:justify-center lg:px-2'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
          >
            <Menu className="h-5 w-5 text-charcoal" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-500 capitalize">{role} Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">{profile.full_name}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
      </div>
    </div>
  )
}
