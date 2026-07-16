'use client'

import Link from 'next/link'
import { Heart, Mail, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'
import { BRAND } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white text-sm font-bold">NM</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{BRAND.name}</h3>
                  <p className="font-arabic text-xs text-secondary">{BRAND.nameAr}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {BRAND.tagline}
              </p>
              <div className="flex gap-3">
                <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-secondary/20 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href={BRAND.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-secondary/20 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-secondary/20 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-display text-base font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/how-it-works', label: 'How It Works' },
                  { href: '/apply', label: 'Apply for Support' },
                  { href: '/success-stories', label: 'Success Stories' },
                  { href: '/islamic-corner', label: 'Islamic Corner' },
                  { href: '/faqs', label: 'FAQs' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-secondary text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: For Sponsors */}
            <div>
              <h4 className="font-display text-base font-semibold mb-4">For Sponsors</h4>
              <ul className="space-y-2">
                {[
                  { href: '/sponsor/browse', label: 'Browse Applications' },
                  { href: '/sponsor/dashboard', label: 'Sponsor Dashboard' },
                  { href: '/sponsor/my-sponsorships', label: 'My Sponsorships' },
                  { href: '/register', label: 'Become a Sponsor' },
                  { href: '/faqs', label: 'Sponsor FAQ' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-secondary text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Legal */}
            <div>
              <h4 className="font-display text-base font-semibold mb-4">Contact & Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors">
                    <Mail className="h-4 w-4" /> {BRAND.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {BRAND.phone}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors">
                    <Heart className="h-4 w-4" /> Contact Us
                  </Link>
                </li>
              </ul>
              <div className="mt-4 space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-secondary text-sm transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-secondary text-sm transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Nikah Muyassar — Powered by <a href="https://badikuutechsolutions.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Badikuu Tech Solutions</a>
            </p>
            <p className="text-center text-gray-500 text-xs mt-1 font-arabic">
              وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
