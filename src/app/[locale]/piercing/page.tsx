import { buildPiercingServiceJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { FaqSection } from './ui/FaqSection'
import { HeroSection } from './ui/HeroSection'
import { LatestPiercingSection } from './ui/LatestPiercingSection'
import { PiercingTimelineSection } from './ui/PiercingTimelineSection'
import { PricingSection } from './ui/PricingSection'

export const generateMetadata = withSeo('metadata.piercingPageMetadata', '/piercing')

export default async function PiercingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="flex flex-col">
      <HeroSection />
      <PiercingTimelineSection />
      <LatestPiercingSection />
      <PricingSection />
      <FaqSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await buildPiercingServiceJsonLd(locale))
        }}
      />
    </main>
  )
}
