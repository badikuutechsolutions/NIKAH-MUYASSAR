import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="applicant">{children}</DashboardLayout>
}
