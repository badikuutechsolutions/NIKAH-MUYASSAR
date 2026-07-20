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
                  <a href={`mailto:${BRAND.supportEmail}`} className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors">
                    <Mail className="h-4 w-4" /> {BRAND.supportEmail}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {BRAND.phone}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${BRAND.phone2.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {BRAND.phone2}
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
