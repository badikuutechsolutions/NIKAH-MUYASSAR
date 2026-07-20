'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ArabicText } from '@/components/ui/arabic-text'
import { VerseCard } from '@/components/ui/verse-card'
import { Heart, Target, Eye, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="default" size="md" className="mb-3">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
            Our Mission: <span className="text-primary">Facilitate Marriage</span>
          </h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Nikah Muyassar (نكاح ميسر) means "The Facilitated Marriage." We are a faith-driven digital platform that connects financially struggling Muslims who wish to marry with generous sponsors who fund their weddings.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Inspired by the Quranic promise in Surah An-Nur 24:32 and the Prophetic teaching to "make things easy," we believe that financial barriers should never prevent a righteous soul from completing half their Deen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          {[
            { icon: Heart, title: 'Our Mission', desc: 'To remove financial barriers to marriage and help sincere Muslims complete their Nikah with dignity and support from the Ummah.' },
            { icon: Eye, title: 'Our Vision', desc: 'A world where no Muslim is prevented from marrying due to financial hardship, and where the Ummah stands united in supporting one another.' },
            { icon: Users, title: 'Our Values', desc: 'Tayseer (making easy), Ta\'awun (mutual cooperation), Amanah (trustworthiness), and Haya\' (modesty and privacy).' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Icon className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display font-bold text-lg text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <VerseCard
          arabic="يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا"
          translation="O mankind, fear your Lord, who created you from one soul and created from it its mate and dispersed from both of them many men and women."
          surah="An-Nisa"
          verse="4:1"
          explanation="This verse reminds us of the unity of humanity and the divine origin of the male-female relationship."
        />
      </div>
    </div>
  )
}
