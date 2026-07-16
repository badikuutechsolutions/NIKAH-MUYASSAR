'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const FAQS = [
  { category: 'general', question: 'What is Nikah Muyassar?', answer: 'Nikah Muyassar (نكاح ميسر — "The Facilitated Marriage") is a faith-driven digital platform that connects financially struggling Muslims who wish to marry with generous sponsors who fund their weddings.' },
  { category: 'applicant', question: 'Who can apply for sponsorship?', answer: 'Any Muslim who genuinely intends Nikah (Islamic marriage contract) and can demonstrate financial hardship. You must provide a reference from a local Imam or trusted Islamic scholar. Both parties must be of legal marriage age in their country.' },
  { category: 'sponsor', question: 'How do I become a sponsor?', answer: 'Simply create an account and select "Sponsor" as your role. You can then browse approved applications, read anonymized stories, and make a sponsorship pledge toward a couple\'s wedding costs.' },
  { category: 'general', question: 'Is there any fee for applicants?', answer: 'No, absolutely zero fees. 100% of all sponsorships go directly to supporting the couples\' weddings.' },
  { category: 'applicant', question: 'What documents do I need to apply?', answer: 'You need: (1) National ID or Passport, (2) Proof of income or financial situation, (3) A letter or reference from your local Imam. Additional supporting documents are optional.' },
  { category: 'sponsor', question: 'Can I sponsor anonymously?', answer: 'Yes! You can choose to hide your identity from the applicant. Your generosity will be known only to Allah.' },
  { category: 'general', question: 'Is my data secure?', answer: 'Absolutely. We use industry-standard encryption and strict access controls. Your personal data is never shared without your consent.' },
  { category: 'islamic', question: 'Is this platform Islamically sound?', answer: 'Yes. All applications are reviewed by qualified Islamic scholars. The platform ensures all marriages are Halal Nikah contracts, and we respect Islamic privacy principles throughout.' },
  { category: 'process', question: 'How long does the application process take?', answer: 'From submission to approval typically takes 5-10 business days, including a review meeting. Sponsorship matching varies depending on available sponsors.' },
  { category: 'sponsor', question: 'Can I specify which type of applicant I want to support?', answer: 'Yes, you can filter applications by country, gender, urgency level, and amount needed. You can also search for specific causes that resonate with you.' },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'applicant', label: 'Applicants' },
  { id: 'sponsor', label: 'Sponsors' },
  { id: 'process', label: 'Process' },
  { id: 'islamic', label: 'Islamic' },
]

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <Badge variant="default" size="md" className="mb-3">❓ FAQs</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>
        <div className="max-w-md mx-auto">
          <Input type="text" placeholder="Search questions..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-light-teal/50 transition-colors"
                >
                  <span className="font-medium text-charcoal text-sm pr-4">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">No FAQs found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  )
}
