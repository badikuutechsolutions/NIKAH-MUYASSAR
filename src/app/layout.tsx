import type { Metadata } from 'next'
import './globals.css'
import { AppLayout } from '@/components/layout/app-layout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Nikah Muyassar — Islamic Marriage Support Platform',
    template: '%s | Nikah Muyassar',
  },
  description: 'A faith-driven digital platform connecting financially struggling Muslims with generous sponsors to facilitate marriage. Because every righteous soul deserves to complete half their Deen.',
  keywords: ['nikah', 'marriage', 'islamic', 'wedding', 'sponsorship', 'sadaqah', 'muslim', 'help', 'ummah'],
  openGraph: {
    title: 'Nikah Muyassar — Islamic Marriage Support Platform',
    description: 'Connecting hearts, fulfilling dreams — because financial barriers should never stand between you and completing half your Deen.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
