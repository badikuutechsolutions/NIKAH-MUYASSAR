'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Heart, Quote, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArabicText } from '@/components/ui/arabic-text'
import { VerseCard } from '@/components/ui/verse-card'
import { VERSES_ON_MARRIAGE, HADITHS_ON_MARRIAGE, DUA_FOR_MARRIAGE } from '@/lib/constants'

export default function IslamicCornerPage() {
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null)
  const [expandedHadith, setExpandedHadith] = useState<number | null>(null)

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <Badge variant="default" size="md" className="mb-3">🕌 Islamic Corner</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Quran & <span className="text-primary">Sunnah</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Islamic guidance on marriage from the Quran and authentic hadith.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Featured Verse */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-2">
            <Star className="h-5 w-5 text-secondary" /> Verse of the Day
          </h2>
          <VerseCard
            arabic="وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ"
            translation="Marry the unmarried among you and the righteous of your male and female servants. If they should be poor, Allah will enrich them from His bounty. And Allah is all-Encompassing and Knowing."
            surah="An-Nur"
            verse="24:32"
            explanation="This verse is the foundational inspiration for Nikah Muyassar. It reminds us that financial hardship should not be a barrier to marriage."
          />
        </motion.div>

        {/* Verses on Marriage */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" /> Verses on Marriage
          </h2>
          <div className="space-y-4">
            {VERSES_ON_MARRIAGE.map((verse, i) => (
              <Card key={i} hover onClick={() => setExpandedVerse(expandedVerse === i ? null : i)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <ArabicText text={verse.arabic} size="lg" className="text-right mb-2" />
                      <p className="text-sm text-gray-600 italic">"{verse.translation}"</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default" size="sm">{verse.surah} {verse.verse}</Badge>
                      </div>
                      {expandedVerse === i && verse.explanation && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                          {verse.explanation}
                        </motion.p>
                      )}
                    </div>
                    <button className="text-gray-400 shrink-0 mt-2">
                      {expandedVerse === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Hadith Collection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-2">
            <Quote className="h-5 w-5 text-secondary" /> Hadith Collection
          </h2>
          <div className="space-y-4">
            {HADITHS_ON_MARRIAGE.map((hadith, i) => (
              <Card key={i} hover onClick={() => setExpandedHadith(expandedHadith === i ? null : i)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-gray-700 font-quote italic leading-relaxed">"{hadith.text}"</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {hadith.narrator && <Badge variant="default" size="sm">{hadith.narrator}</Badge>}
                        <Badge variant="status" size="sm">{hadith.source}</Badge>
                        {hadith.reference && <span className="text-xs text-gray-400">{hadith.reference}</span>}
                        {hadith.grade && <Badge variant="status" size="sm" className="bg-green-100 text-green-700">{hadith.grade}</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Du'a */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" /> Du'a for Marriage
          </h2>
          <Card className="bg-gradient-to-br from-soft to-white border-accent/20">
            <CardContent className="p-8 text-center">
              <ArabicText text={DUA_FOR_MARRIAGE.arabic} size="xl" className="text-center mb-4 leading-loose" />
              <p className="text-sm text-gray-500 italic mb-1">{DUA_FOR_MARRIAGE.transliteration}</p>
              <p className="text-gray-600 font-quote italic mb-2">"{DUA_FOR_MARRIAGE.translation}"</p>
              <p className="text-xs text-primary font-semibold">{DUA_FOR_MARRIAGE.reference}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
