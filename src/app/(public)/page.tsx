'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Heart, Shield, Globe, Quote, Sparkles, HandHeart, BookOpen, Users, DollarSign, MapPin, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArabicText } from '@/components/ui/arabic-text'
import { Badge } from '@/components/ui/badge'

const COUNTER_DATA = [
  { icon: Heart, value: 0, suffix: '', label: 'Couples Married' },
  { icon: DollarSign, value: 0, suffix: '', label: 'Total Sponsored', prefix: '$' },
  { icon: MapPin, value: 0, suffix: '', label: 'Countries Reached' },
  { icon: Users, value: 0, suffix: '', label: 'Active Sponsors' },
]

const ISLAMIC_WISDOM = [
  { text: '"When a servant marries, he has completed half of his religion, so let him fear Allah regarding the remaining half."', source: "Shu'ab al-Iman, no. 5486" },
  { text: '"Marry the unmarried among you... If they should be poor, Allah will enrich them from His bounty."', source: 'Surah An-Nur 24:32' },
  { text: '"Nothing has been seen for two who love one another like nikah (marriage)."', source: 'Sunan Ibn Majah, no. 1847' },
  { text: '"The best of you is the one who is best to his wife, and I am the best of you to my wives."', source: 'Sunan at-Tirmidhi, no. 3895' },
  { text: '"The most blessed marriage is the one that is easiest (least burdensome)."', source: 'Bayhaqi, graded Hasan' },
  { text: '"And among His signs is that He created for you from yourselves mates that you may find tranquility in them."', source: 'Surah Ar-Rum 30:21' },
  { text: '"There are three whose help is a right upon Allah... the one who marries wanting chastity."', source: 'Sunan at-Tirmidhi, no. 1655' },
  { text: '"O young men, whoever among you can afford it, let him get married..."', source: 'Sahih Bukhari, no. 5066' },
]

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(countRef, { once: true })

  useEffect(() => {
    if (!inView) return
    let startTime: number
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, end, duration])

  return <span ref={countRef}>{count}</span>
}

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const [wisdomIndex, setWisdomIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWisdomIndex((i) => (i + 1) % ISLAMIC_WISDOM.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cream to-accent/5" />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="default" size="md" className="mb-6">
              Completing Half Your Deen
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ArabicText text={'\u0646\u0643\u0627\u062D \u0645\u064A\u0633\u0631'} size="2xl" className="text-primary mb-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-charcoal leading-tight mb-3"
          >
            Connecting Hearts,
            <br />
            <span className="text-primary">Fulfilling Dreams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg md:text-xl text-secondary-dark font-arabic font-bold mb-2"
          >
            &#x201C;Tende na Maji Adui ni Zina&#x201D;
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Because financial barriers should never stand between you and completing half your Deen
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10"
          >
            <div className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-secondary/20">
              <Quote className="h-6 w-6 text-secondary mb-2" />
              <p className="text-lg md:text-xl text-charcoal/90 italic font-quote leading-relaxed mb-2">
                &ldquo;And among His signs is that He created for you from yourselves mates that you may find tranquility in them, and He placed between you affection and mercy.&rdquo;
              </p>
              <p className="text-sm text-primary font-semibold">Surah Ar-Rum, 30:21</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/apply">
              <Button variant="primary" size="lg" icon={<Heart className="h-5 w-5" />}>
                Apply for Support
              </Button>
            </Link>
            <Link href="/sponsor/browse">
              <Button variant="secondary" size="lg" icon={<Sparkles className="h-5 w-5" />}>
                Become a Sponsor
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-32 right-20 text-4xl opacity-20 hidden lg:block"
        >
          {'\u{1F319}'}
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 left-16 text-2xl opacity-20 hidden lg:block"
        >
          {'\u2B50'}
        </motion.div>
      </section>

      {/* Section 2: Stats Banner */}
      <AnimatedSection>
        <div className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {COUNTER_DATA.map((stat) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white font-display">
                      {stat.prefix || ''}<CountUp end={stat.value} />{stat.suffix}
                    </div>
                    <div className="text-white/70 text-sm mt-1 font-medium">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 3: Quranic Promise */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <ArabicText
              text={'\u0648\u0623\u064E\u0646\u0643\u0650\u062D\u064F\u0648\u0627 \u0627\u0644\u0652\u0623\u064E\u064A\u064E\u0627\u0645\u064E\u0649\u0670 \u0645\u0650\u0646\u0643\u064F\u0645\u0652 \u0625\u0650\u0646 \u064A\u064E\u0643\u064F\u0648\u0646\u064F\u0648\u0627 \u0641\u064F\u0642\u064E\u0631\u064E\u0627\u0621\u064E \u064A\u064F\u063A\u0652\u0646\u0650\u0647\u0650\u0645\u064F \u0627\u0644\u0644\u0651\u0647\u064F \u0645\u0650\u0646 \u0641\u064E\u0636\u0652\u0644\u0650\u0647\u0650'}
              size="2xl"
              className="text-secondary mb-6 leading-loose"
            />
            <p className="text-xl md:text-2xl text-white/90 font-quote italic leading-relaxed max-w-3xl mx-auto">
              &ldquo;Marry the unmarried among you... If they should be poor, Allah will enrich them from His bounty. And Allah is all-Encompassing and Knowing.&rdquo;
            </p>
            <p className="text-secondary text-sm mt-4 font-semibold">Surah An-Nur, 24:32</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <AnimatedSection>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="default" size="md" className="mb-3">Simple Process</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal">How It Works</h2>
              <p className="text-gray-500 mt-2">Three simple steps to facilitate a marriage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '01', icon: '\u{1F4DD}', title: 'Apply', desc: 'Submit your application with personal details, financial situation, and required documents.' },
                { step: '02', icon: '\u{1F50D}', title: 'Get Reviewed', desc: 'Our team and Islamic scholars review your application and verify your eligibility.' },
                { step: '03', icon: '\u{1F48D}', title: 'Get Sponsored', desc: 'A generous sponsor funds your blessed marriage. You get married and start your new life.' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <Card hover className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <div className="text-xs font-bold text-primary mb-1">Step {item.step}</div>
                      <h3 className="text-xl font-display font-bold text-charcoal mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/how-it-works">
                <Button variant="ghost" icon={<ArrowRight className="h-4 w-4" />}>
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Section 5: How Sponsorship Works */}
      <AnimatedSection>
        <section className="py-20 bg-light-teal/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="default" size="md" className="mb-3">Why Sponsor?</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal">The Rewards of Sponsoring a Marriage</h2>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">The Prophet &#65018; said: &ldquo;There are three whose help is a right upon Allah: the one who marries wanting chastity.&rdquo; &mdash; Sunan at-Tirmidhi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: 'Sadaqah Jariyah', desc: 'Every moment of their blessed marriage becomes ongoing charity for you. Every child they raise, every good deed they do &mdash; your reward continues.' },
                { icon: Users, title: 'Strengthen the Ummah', desc: 'By facilitating a Halal marriage, you help protect brothers and sisters from haram relationships and strengthen the fabric of the Muslim community.' },
                { icon: Award, title: 'Complete Half Their Deen', desc: 'The Prophet &#65018; said marriage completes half of one\'s faith. By sponsoring, you become a partner in this noble achievement.' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
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

            <div className="text-center mt-10">
              <Link href="/how-it-works">
                <Button variant="primary" size="lg" icon={<Heart className="h-5 w-5" />}>
                  Learn How to Sponsor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Section 6: Islamic Wisdom */}
      <AnimatedSection>
        <section className="py-20 bg-gradient-to-br from-gold-light to-cream">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Badge variant="default" size="md" className="mb-3">Islamic Wisdom</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-8">Prophetic Guidance on Marriage</h2>

            <div className="relative">
              <motion.div
                key={wisdomIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-secondary/20"
              >
                <Quote className="h-8 w-8 text-secondary/40 mx-auto mb-4" />
                <p className="text-xl md:text-2xl font-quote italic text-charcoal leading-relaxed mb-4">
                  {ISLAMIC_WISDOM[wisdomIndex].text}
                </p>
                <p className="text-sm text-primary font-semibold">{ISLAMIC_WISDOM[wisdomIndex].source}</p>
              </motion.div>

              <div className="flex justify-center gap-2 mt-6">
                {ISLAMIC_WISDOM.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWisdomIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === wisdomIndex ? 'bg-primary' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Section 7: Islamic Principles */}
      <AnimatedSection>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="default" size="md" className="mb-3">Our Foundation</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal">Built on Islamic Values</h2>
              <p className="text-gray-500 mt-2">Every aspect of this platform is guided by the timeless principles of Islam</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: BookOpen, title: 'Tayseer (Making Easy)', arabic: 'تيسير', desc: 'The Prophet &#65018; said: "Make things easy, do not make them difficult." Every UX decision reduces friction, making the path to marriage smoother.' },
                { icon: Heart, title: 'Ta\'awun (Cooperation)', arabic: 'تعاون', desc: '"The believers in their mutual kindness, compassion, and sympathy are just like one body." Sponsors and applicants are two parts of the same Ummah.' },
                { icon: Shield, title: 'Amanah (Trustworthiness)', arabic: 'أمانة', desc: '"The trustworthy merchant is with the prophets, the truthful, and the martyrs." Every data point, document, and sponsorship is handled with the highest trust.' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card hover className="h-full overflow-hidden">
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <p className="font-arabic text-lg text-primary mb-1">{item.arabic}</p>
                        <h3 className="text-lg font-display font-bold text-charcoal mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Section 8: Trust Signals */}
      <AnimatedSection>
        <div className="py-16 bg-charcoal text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: 'Confidential', desc: 'Your data is private and secure' },
                { icon: BookOpen, title: 'Scholar-Verified', desc: 'Applications reviewed by qualified scholars' },
                { icon: Heart, title: 'Zero Fees', desc: '100% of sponsorships go to the couple' },
                { icon: Globe, title: 'Global', desc: 'Serving Muslims across 28 countries' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-display font-bold text-base mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 9: Sponsor CTA */}
      <AnimatedSection>
        <section className="py-20 bg-gradient-to-r from-secondary/20 via-gold-light to-secondary/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <HandHeart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
                Be the reason two hearts unite
              </h2>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-secondary/20">
                <p className="text-lg font-quote italic text-charcoal/90">
                  &ldquo;There are three whose help is a right upon Allah: the one striving in the path of Allah, the contracted slave who intends to pay off his contract, and the one who marries wanting chastity.&rdquo;
                </p>
                <p className="text-sm text-primary font-semibold mt-2">Sunan at-Tirmidhi, no. 1655</p>
              </div>
              <Link href="/sponsor/browse">
                <Button variant="primary" size="lg" icon={<Sparkles className="h-5 w-5" />}>
                  Start Sponsoring Today
                </Button>
              </Link>
              <p className="text-gray-500 text-sm mt-4">Join 180+ sponsors already changing lives</p>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Section 10: Final CTA */}
      <AnimatedSection>
        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Complete Half Your Deen?
              </h2>
              <p className="text-primary/80 text-lg mb-8 max-w-2xl mx-auto">
                Whether you&rsquo;re seeking support or ready to sponsor a marriage, your journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button variant="secondary" size="lg" icon={<Heart className="h-5 w-5" />}>
                    Apply Now
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<ArrowRight className="h-5 w-5" />}
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}
