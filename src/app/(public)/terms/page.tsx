'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Heart, Shield, Users } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="default" size="md" className="mb-3">📋 Terms of Service</Badge>
          <h1 className="text-4xl font-display font-bold text-charcoal mb-4">Terms of Service</h1>
          <p className="text-gray-500">Last updated: January 2024</p>
        </div>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <Section title="1. Acceptance of Terms">
            By accessing or using Nikah Muyassar, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
          </Section>

          <Section title="2. Description of Service">
            Nikah Muyassar is a faith-driven digital platform that connects financially struggling Muslims who wish to marry with generous sponsors. We facilitate the application, verification, and sponsorship process but do not guarantee that any application will be sponsored.
          </Section>

          <Section title="3. User Eligibility">
            To use our platform, you must be at least 18 years old and legally capable of entering into a binding contract. Applicants must be Muslim and genuinely intending Nikah (Islamic marriage contract) with demonstrated financial hardship.
          </Section>

          <Section title="4. User Responsibilities">
            You agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account. You agree not to misuse the platform for any unlawful purpose.
          </Section>

          <Section title="5. Sponsorship & Payments">
            Sponsorships are voluntary contributions. We do not guarantee that any specific application will receive funding. All sponsorship amounts are final. In case of fraud or misrepresentation, we reserve the right to cancel sponsorships and pursue appropriate action.
          </Section>

          <Section title="6. Privacy & Data Protection">
            We collect and process personal data as described in our Privacy Policy. By using our platform, you consent to such processing and warrant that all data provided is accurate.
          </Section>

          <Section title="7. Limitation of Liability">
            Nikah Muyassar is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform. We are not responsible for the outcome of any marriage facilitated through our platform.
          </Section>

          <Section title="8. Islamic Compliance">
            All services provided through this platform are intended to comply with Islamic principles. We reserve the right to reject any application or sponsorship that we deem inconsistent with Islamic values.
          </Section>

          <Section title="9. Changes to Terms">
            We reserve the right to modify these terms at any time. Users will be notified of material changes. Continued use after changes constitutes acceptance of the new terms.
          </Section>

          <Section title="10. Contact">
            For questions about these terms, please contact us at support@nikahmuyassar.org.
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="font-display font-bold text-lg text-charcoal mb-2">{title}</h2>
      <p>{children}</p>
    </motion.div>
  )
}
