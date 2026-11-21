import type { AppLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { getPathname } from '@/i18n/navigation'
import { Suspense } from 'react'
import { buildPermanentMakeupServiceJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import FadeContent from '@/shared/FadeContent'
import { FaqSection } from '@/shared/FaqSection'
import FoldText from '@/shared/FoldText'
import { GallerySection, GallerySectionFallback } from './ui/GallerySection'
import { HeroSection } from './ui/HeroSection'
import { ServicesSection } from './ui/ServicesSection'

export const generateMetadata = withSeo('metadata.permanentPageMetadata', '/permanent')

export default async function PermanentPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'permanentPage' })
  return (
    <main className="flex flex-col">
      <HeroSection />
      <Suspense fallback={<GallerySectionFallback />}>
        <GallerySection />
      </Suspense>
      <ServicesSection />
      <FaqSection titleId="permanent-faq-title" title={t('faq.title')} items={t.raw('faq.items')} />
      <div className="bg-zinc-900">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
          <ContactsSection
            title={<FoldText text={t('booking.title')} />}
            text={t.rich('booking.text', {
              emphasis: (chunks) => <strong className="text-xl/none font-bold text-red-600">{chunks}</strong>
            })}
            studioLinks={{
              contacts: { label: t('booking.contacts'), href: getPathname({ locale, href: '/contacts' }) },
              home: { label: t('booking.home'), href: getPathname({ locale, href: '/' }) }
            }}
            showNightSessions={false}
          />
        </FadeContent>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await buildPermanentMakeupServiceJsonLd(locale))
        }}
      />
    </main>
  )
}
