import type { AppLocale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'
import { Suspense } from 'react'
import { buildPermanentMakeupServiceJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import { DescriptionSection } from './ui/DescriptionSection'
import { GallerySection, GallerySectionFallback } from './ui/GallerySection'
import { HeroSection } from './ui/HeroSection'
import { ServicesSection } from './ui/ServicesSection'

export const generateMetadata = withSeo('metadata.permanentPageMetadata', '/permanent')

export default async function PermanentPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'permanentPage' })
  const guide = t.raw('guide') as { title: string; text: string }[]
  const faq = t.raw('faq.items') as { question: string; answer: string }[]
  return (
    <main className="flex flex-col">
      <HeroSection />
      <DescriptionSection />
      <ServicesSection />
      <section className="bg-zinc-900 pb-20">
        <div className="container grid gap-6 md:grid-cols-2">
          {guide.map(({ title, text }) => (
            <div key={title} className="rounded-2xl bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
              <p className="leading-relaxed text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <Suspense fallback={<GallerySectionFallback />}>
        <GallerySection />
      </Suspense>
      <section className="bg-zinc-900 pb-20">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold text-white">{t('faq.title')}</h2>
            {faq.map(({ question, answer }) => (
              <div key={question} className="border-b border-zinc-700 pb-5">
                <h3 className="mb-2 text-lg font-semibold text-white">{question}</h3>
                <p className="leading-relaxed text-zinc-300">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactsSection title={t('booking.title')} text={t('booking.text')} showNightSessions={false} />
      <div className="flex flex-wrap justify-center gap-6 bg-zinc-900 px-4 pb-12 text-rose-200 underline underline-offset-4">
        <Link href={getPathname({ locale, href: '/contacts' })}>{t('booking.contacts')}</Link>
        <Link href={getPathname({ locale, href: '/' })}>{t('booking.home')}</Link>
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
