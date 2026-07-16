'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, Database, Mail, Trash2 } from 'lucide-react'

const SECTIONS = [
  { icon: Shield, title: 'Information We Collect', content: 'We collect information you provide directly: name, email, phone, financial information, and documents required for the application process. We also collect usage data such as page visits and interactions to improve our service.' },
  { icon: Lock, title: 'How We Use Your Information', content: 'Your information is used to process your application, facilitate sponsorships, communicate with you about your account, and improve our platform. We never sell your personal data to third parties.' },
  { icon: Eye, title: 'Data Sharing & Visibility', content: 'Your personal information is only shared with platform staff and reviewers as necessary for the application process. Sponsors only see anonymized profiles. Your identity documents are never shared publicly.' },
  { icon: Database, title: 'Data Storage & Security', content: 'We use industry-standard encryption for data at rest and in transit. All files are stored securely on Cloudinary with restricted access. Our database is hosted on Supabase with Row-Level Security ensuring your data is only accessible by authorized parties.' },
  { icon: Mail, title: 'Communication', content: 'We may send you emails related to your account, application status updates, and important platform announcements. You can opt out of non-essential communications at any time.' },
  { icon: Trash2, title: 'Your Rights & Data Deletion', content: 'You have the right to access, correct, or delete your personal data at any time. To request data deletion, please contact our support team. We will process your request within 30 days.' },
]

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="default" size="md" className="mb-3">🔒 Privacy Policy</Badge>
          <h1 className="text-4xl font-display font-bold text-charcoal mb-4">Your Privacy Matters</h1>
          <p className="text-gray-500">Last updated: January 2024</p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-charcoal mb-2">{section.title}</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 p-6 bg-light-teal rounded-xl">
          <h2 className="font-display font-bold text-lg text-charcoal mb-3">Contact Us About Privacy</h2>
          <p className="text-sm text-gray-600 mb-2">If you have any questions about this privacy policy or your data, please contact us:</p>
          <a href="mailto:privacy@nikahmuyassar.org" className="text-primary hover:underline text-sm">privacy@nikahmuyassar.org</a>
        </div>
      </div>
    </div>
  )
}
