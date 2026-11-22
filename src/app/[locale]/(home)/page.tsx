import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { AboutSection } from '../ui/AboutSection'
import { AdvantagesSection } from '../ui/AdvantagesSection'
import HeroSlider from '../ui/HeroSlider'
import { HeroSliderFallback } from '../ui/HeroSliderFallback'
import { LocationSection } from '../ui/LocationSection'
import { OurServicesSection } from '../ui/OurServicesSection'
import { PortfolioSection } from '../ui/PortfolioSection'
import { SketchesSection } from '../ui/SketchesSection'

export const generateMetadata = withSeo('metadata.homePageMetadata')

export default async function Home() {
  const t = await getTranslations('homePage')
  const labels = await getTranslations('pageSpeedLabel.homeSlider')

  return (
    <main className="flex flex-col">
      <Suspense fallback={<HeroSliderFallback cards={t.raw('heroSection.cards')} />}>
        <HeroSlider
          cards={t.raw('heroSection.cards')}
          labels={{
            previousSlide: labels('previousSlide'),
            nextSlide: labels('nextSlide'),
            slide: labels('slide'),
            pause: labels('pause'),
            play: labels('play')
          }}
        />
      </Suspense>
      <OurServicesSection />
      <AboutSection />
      <SketchesSection />
      <AdvantagesSection translations={t.raw('advantagesSection')} />
      <PortfolioSection />
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="bg-zinc-900">
        <ContactsSection title={<FoldText text={t('contactsSection.title')} />} />
      </FadeContent>
      <LocationSection animate />
    </main>
  )
}
