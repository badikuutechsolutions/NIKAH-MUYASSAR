import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VerseCard } from '@/components/ui/verse-card'

export default function StoryDetailPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/success-stories" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Stories
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <div className="text-center">
              <Heart className="h-12 w-12 text-white/60 mx-auto mb-2" />
              <h1 className="text-3xl font-display font-bold text-white">Story Coming Soon</h1>
              <p className="text-primary/80">in sha Allah</p>
            </div>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">
              This story is not yet available. As couples are sponsored and married through this platform, their stories — with their consent — will be shared here to inspire and encourage others.
            </p>
            <p className="text-gray-400 mb-6">
              If you have a story to share, please contact us at hamoudybadi@gmail.com
            </p>
            <Link href="/success-stories">
              <Button variant="outline">Browse All Stories</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <VerseCard
            arabic="رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا"
            translation="Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous."
            surah="Al-Furqan"
            verse="25:74"
          />
        </div>
      </div>
    </div>
  )
}
