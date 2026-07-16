'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ClipboardList, Search, Handshake, Heart, FileText, Calendar, Star, Upload, MessageSquare, Users, Shield, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArabicText } from '@/components/ui/arabic-text'
import Link from 'next/link'

const TABS = [
  { id: 'applicants', label: 'For Applicants', icon: ClipboardList },
  { id: 'sponsors', label: 'For Sponsors', icon: Heart },
  { id: 'review', label: 'Our Review Process', icon: Shield },
]

const APPLICANT_STEPS = [
  { step: 1, icon: FileText, title: 'Create Free Account', time: '2 minutes', desc: 'Sign up with your email and select "Applicant" as your role.' },
  { step: 2, icon: ClipboardList, title: 'Fill Application Form', time: '15-20 minutes', desc: 'Complete our detailed application with your personal, financial, and Islamic background.' },
  { step: 3, icon: Upload, title: 'Upload Documents', time: '5 minutes', desc: 'Upload your ID, income proof, and Imam reference letter.' },
  { step: 4, icon: Search, title: 'Wait for Review', time: '3-7 business days', desc: 'Our team reviews your application for completeness and eligibility.' },
  { step: 5, icon: MessageSquare, title: 'Meet with Reviewer', time: '30-minute call', desc: 'A video or phone call with a qualified reviewer to verify your situation.' },
  { step: 6, icon: Star, title: 'Receive Approval', time: '1-2 days post-meeting', desc: 'Once verified, your application is approved and visible to sponsors.' },
  { step: 7, icon: Handshake, title: 'Get Sponsored', time: '1-4 weeks', desc: 'A generous sponsor funds your wedding expenses.' },
  { step: 8, icon: Heart, title: 'Get Married!', time: 'Whenever ready', desc: 'Alhamdulillah! You complete your Nikah and start your blessed journey together.' },
]

const SPONSOR_STEPS = [
  { step: 1, icon: FileText, title: 'Create Account', time: '2 minutes', desc: 'Sign up and select "Sponsor" as your role.' },
  { step: 2, icon: Search, title: 'Browse Applications', time: 'As needed', desc: 'View anonymized profiles of approved applicants from around the world.' },
  { step: 3, icon: Heart, title: 'Choose a Couple', time: 'Your choice', desc: 'Select an application that resonates with your heart and capacity.' },
  { step: 4, icon: Handshake, title: 'Make a Pledge', time: '5 minutes', desc: 'Commit to sponsoring part or all of their wedding costs.' },
  { step: 5, icon: Star, title: 'Complete Payment', time: 'Varies', desc: 'Transfer your sponsorship via bank, online, or other methods.' },
  { step: 6, icon: Heart, title: 'Receive Du\'a', time: 'Lifetime', desc: 'The couple prays for you. Your Sadaqah Jariyah continues with their blessed union.' },
]

const REVIEW_STEPS = [
  { step: 1, icon: FileText, title: 'Document Verification', desc: 'Reviewers check that all required documents are authentic and complete.' },
  { step: 2, icon: Users, title: 'Islamic Scholar Review', desc: 'Qualified scholars assess the Islamic authenticity and sincerity of the application.' },
  { step: 3, icon: MessageSquare, title: 'Interview Meeting', desc: 'A personal meeting (video/phone/in-person) to verify the applicant\'s situation.' },
  { step: 4, icon: Shield, title: 'Final Approval', desc: 'Once all checks pass, the application is marked as "Approved" and opened for sponsors.' },
]

const REQUIREMENTS = [
  { text: 'Must be Muslim (any school of thought)', valid: true },
  { text: 'Genuinely intending Nikah (Islamic marriage contract)', valid: true },
  { text: 'Demonstrated financial hardship', valid: true },
  { text: 'Must provide a reference from a local Imam or trusted Islamic scholar', valid: true },
  { text: 'Both parties must be of legal marriage age in their country', valid: true },
  { text: 'Must not have previously received sponsorship through this platform', valid: true },
  { text: 'Platform is not for those who can self-finance their marriage', valid: false },
  { text: 'Not for temporary / misyar marriage arrangements', valid: false },
]

const DOCUMENTS = [
  { name: 'National ID or Passport', required: true, desc: 'Clear scan or photo of your government-issued identification.' },
  { name: 'Proof of Income/Financial Situation', required: true, desc: 'Salary slip, bank statement, or a written financial statement.' },
  { name: 'Imam Reference Letter', required: true, desc: 'A letter or reference from your local Imam confirming your character and sincerity.' },
  { name: 'Additional Supporting Documents', required: false, desc: 'Any other documents that support your application (optional).' },
]

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('applicants')

  return (
    <div className="py-12">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <Badge variant="default" size="md" className="mb-3">📖 How It Works</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Your Journey to Nikah,<br />
          <span className="text-primary">Supported by the Ummah</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Whether you&apos;re seeking support or wanting to sponsor, here&apos;s how our platform works.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="flex bg-light-teal rounded-xl p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto px-4"
        >
          {activeTab === 'applicants' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {APPLICANT_STEPS.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.step} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary">Step {step.step}</span>
                            <span className="text-xs text-gray-400">~{step.time}</span>
                          </div>
                          <h3 className="font-semibold text-charcoal">{step.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Eligibility */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-xl font-display font-bold text-charcoal mb-4">Eligibility Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {REQUIREMENTS.map((req, i) => (
                    <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${req.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                      {req.valid ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
                      <span className={`text-sm ${req.valid ? 'text-green-800' : 'text-red-700'}`}>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-xl font-display font-bold text-charcoal mb-4">Required Documents</h2>
                <div className="space-y-3">
                  {DOCUMENTS.map((doc, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-light-teal">
                      <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-charcoal">
                          {doc.name} {doc.required && <span className="text-red-500 text-xs">(Required)</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Link href="/apply">
                  <Button variant="primary" size="lg">Start Your Application</Button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'sponsors' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPONSOR_STEPS.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.step} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-secondary-dark" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-secondary-dark">Step {step.step}</span>
                            <span className="text-xs text-gray-400">{step.time}</span>
                          </div>
                          <h3 className="font-semibold text-charcoal">{step.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-gold-light rounded-xl p-6 border border-secondary/20">
                <h2 className="text-xl font-display font-bold text-charcoal mb-3">Why Sponsor?</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Earn continuous Sadaqah Jariyah with every moment of their marriage</li>
                  <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Help a brother or sister complete half their Deen</li>
                  <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Choose to sponsor anonymously if you prefer</li>
                  <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> See the direct impact of your generosity</li>
                </ul>
              </div>

              <div className="text-center">
                <Link href="/sponsor/browse">
                  <Button variant="secondary" size="lg">Browse Applications</Button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-8">
              <p className="text-gray-500 text-center max-w-2xl mx-auto">
                Our review process ensures that every application is authentic, sincere, and Islamically sound. Here&apos;s how we maintain trust and integrity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REVIEW_STEPS.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.step} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-primary">Step {step.step}</span>
                          <h3 className="font-semibold text-charcoal">{step.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
