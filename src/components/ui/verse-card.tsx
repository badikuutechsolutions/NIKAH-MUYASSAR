'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from './card'
import { ArabicText } from './arabic-text'
import { Quote } from 'lucide-react'

interface VerseCardProps {
  arabic: string
  translation: string
  surah: string
  verse: string
  explanation?: string
}

export function VerseCard({ arabic, translation, surah, verse, explanation }: VerseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-gold-light to-white border-secondary/20 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Quote className="h-8 w-8 text-secondary/40 shrink-0 mt-2" />
            <div className="space-y-4">
              <ArabicText text={arabic} size="xl" className="text-right text-charcoal" />
              <p className="text-charcoal/80 font-body leading-relaxed">&ldquo;{translation}&rdquo;</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">
                  {surah} {verse}
                </span>
              </div>
              {explanation && (
                <p className="text-sm text-gray-500 italic border-t border-secondary/20 pt-3">
                  {explanation}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
