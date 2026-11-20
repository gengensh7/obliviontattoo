import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { ContactsSection } from '@/shared/ContactsSection'
import { buildTattooServiceJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { AboutSection } from './ui/AboutSection'
import { HeroSection } from './ui/HeroSection'
import { LatestTattoo, LatestTattooFallback } from './ui/LatestTattoo'
import { ServicesSection } from './ui/ServicesSection'

export const generateMetadata = withSeo('metadata.tattooPageMetadata', '/tattoo')

export default async function TattooPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tattooPage' })
  const faq = t.raw('faq.items') as { question: string; answer: string }[]
  return (
    <main className="flex flex-col">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <Suspense fallback={<LatestTattooFallback />}>
        <LatestTattoo />
      </Suspense>
      <section className="bg-zinc-900 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold text-white">{t('faq.title')}</h2>
            {faq.map(({ question, answer }) => (
              <div key={question} className="border-b border-zinc-700 pb-5">
                <h3 className="mb-2 text-lg font-semibold text-white">{question}</h3>
                <p className="leading-relaxed text-zinc-300">{answer}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-6 text-rose-200 underline underline-offset-4">
              <Link href={getPathname({ locale, href: '/contacts' })}>{t('booking.contacts')}</Link>
              {locale === 'ru' && <Link href="/blog/uhod-za-tatu-posle-sansa-oblivion-tattoo">{t('booking.care')}</Link>}
            </div>
          </div>
        </div>
      </section>
      <ContactsSection title={t('booking.title')} text={t('booking.text')} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await buildTattooServiceJsonLd(locale))
        }}
      />
    </main>
  )
}
