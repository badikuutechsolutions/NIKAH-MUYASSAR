'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, User, LogOut, Heart, LayoutDashboard, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/hooks'

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/success-stories', label: 'Success Stories' },
  { href: '/islamic-corner', label: 'Islamic Corner' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile, loading } = useUser()

  const getDashboardLink = () => {
    if (!profile) return '/dashboard'
    switch (profile.role) {
      case 'applicant': return '/dashboard'
      case 'sponsor': return '/sponsor/dashboard'
      case 'admin':
      case 'reviewer': return '/admin/dashboard'
      default: return '/dashboard'
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xs font-bold">NM</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold text-charcoal hidden sm:block">Nikah Muyassar</span>
              <span className="font-arabic text-xs text-primary hidden sm:block">نكاح ميسر</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary bg-light-teal'
                    : 'text-gray-600 hover:text-primary hover:bg-light-teal/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-20 animate-pulse bg-gray-200 rounded-lg" />
            ) : user ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Dashboard</span>
                  </Button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-light-teal transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-charcoal truncate">{profile?.full_name}</p>
                          <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                        </div>
                        <Link href="/notifications" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-light-teal transition-colors">
                          <Bell className="h-4 w-4" /> Notifications
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-light-teal transition-colors">
                          <User className="h-4 w-4" /> Profile Settings
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={async () => {
                            const { supabase } = await import('@/lib/supabase')
                            await supabase.auth.signOut()
                            window.location.href = '/'
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-light-teal transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5 text-charcoal" /> : <Menu className="h-5 w-5 text-charcoal" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-cream overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-light-teal'
                      : 'text-gray-600 hover:text-primary hover:bg-light-teal/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={async () => {
                    const { supabase } = await import('@/lib/supabase')
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
