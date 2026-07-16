'use client'

import { Navbar } from './navbar'
import { Footer } from './footer'
import { ToastProvider } from '@/components/ui/toast'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  )
}
