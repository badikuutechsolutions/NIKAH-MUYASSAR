'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, BookOpen, Camera, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function SuccessStoriesPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <Badge variant="default" size="md" className="mb-3">Success Stories</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Share Your <span className="text-primary">Blessings</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          This page will feature real success stories of couples who have been united through the blessings of Allah and the generosity of the Ummah. If you have been sponsored through this platform, we invite you to share your story to inspire others.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Heart,
              title: 'Your Story Matters',
              desc: 'Every marriage facilitated through this platform is a testament to the power of community and faith. Your story could inspire sponsors and give hope to other couples.',
            },
            {
              icon: BookOpen,
              title: 'Share Your Journey',
              desc: 'Tell us how you found each other, how the sponsorship helped you, and how your married life has been. Your words will encourage更多人 to participate in this noble cause.',
            },
            {
              icon: Camera,
              title: 'Photos Welcome',
              desc: 'If you\'re comfortable, share a photo from your wedding or nikah ceremony. All photos will be used with your explicit consent and can be anonymized if you prefer.',
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-charcoal mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-br from-gold-light to-white rounded-2xl border border-secondary/20 p-8 text-center"
        >
          <Upload className="h-10 w-10 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-charcoal mb-3">Have a Story to Share?</h2>
          <p className="text-gray-500 mb-2">If you or someone you know has been sponsored through this platform, we would love to hear from you.</p>
          <p className="text-gray-400 text-sm mb-6">Contact us at hamoudybadi@gmail.com to share your blessed journey.</p>
          <Link href="/contact">
            <Button variant="primary" icon={<Heart className="h-5 w-5" />}>Contact Us</Button>
          </Link>
        </motion.div>

        <div className="mt-12">
          <div className="text-center p-12 bg-light-teal rounded-2xl">
            <Badge variant="default" size="md" className="mb-3">Coming Soon</Badge>
            <h2 className="text-2xl font-display font-bold text-charcoal mb-3">Real Stories Loading...</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              As couples are sponsored and married through this platform, their stories will be featured here with their consent. Be the first to share your blessing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
