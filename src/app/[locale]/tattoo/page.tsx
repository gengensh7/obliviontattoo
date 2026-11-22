import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { ContactsSection } from '@/shared/ContactsSection'
import FadeContent from '@/shared/FadeContent'
import { FaqSection } from '@/shared/FaqSection'
import FoldText from '@/shared/FoldText'
import { buildTattooServiceJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { AboutSection } from './ui/AboutSection'
import { HeroSection } from './ui/HeroSection'
import { LatestTattoo } from './ui/LatestTattoo'
import { ServicesSection } from './ui/ServicesSection'

export const generateMetadata = withSeo('metadata.tattooPageMetadata', '/tattoo')

export default async function TattooPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tattooPage' })
  return (
    <main className="flex flex-col">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <LatestTattoo />
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="bg-zinc-900">
        <FaqSection titleId="tattoo-faq-title" title={t('faq.title')} items={t.raw('faq.items')} className="py-20">
          <div className="flex flex-wrap gap-4">
            <CtaLink href={getPathname({ locale, href: '/contacts' })} className="w-full md:w-auto">
              {t('booking.contacts')}
            </CtaLink>
            <CtaLink href={getPathname({ locale, href: '/blog/uhod-za-tatu-posle-sansa-oblivion-tattoo' })} className="w-full md:w-auto">
              {t('booking.care')}
            </CtaLink>
          </div>
        </FaqSection>
      </FadeContent>
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="bg-zinc-900">
        <ContactsSection title={<FoldText text={t('booking.title')} />} text={t('booking.text')} />
      </FadeContent>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await buildTattooServiceJsonLd(locale))
        }}
      />
    </main>
  )
}
