import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="sponsor">{children}</DashboardLayout>
}
