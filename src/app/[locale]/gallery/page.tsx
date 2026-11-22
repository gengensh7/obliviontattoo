import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { routing, type AppLocale } from '@/i18n/routing'
import { getGalleryImages } from '@/lib/galleryImages'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import FadeContent from '@/shared/FadeContent'
import { FaqSection } from '@/shared/FaqSection'
import FoldText from '@/shared/FoldText'
import { GalleryFeed } from './ui/GalleryFeed'
import { GalleryGridSkeleton } from './ui/GalleryGridSkeleton'
import { GalleryHero } from './ui/GalleryHero'

export const generateMetadata = withSeo('metadata.galleryPageMetadata', '/gallery')

async function GalleryPhotos({ locale }: { locale: AppLocale }) {
  const [initial, t, viewer] = await Promise.all([
    getGalleryImages(locale),
    getTranslations('galleryPage'),
    getTranslations('homePage.portfolioSection')
  ])

  return (
    <GalleryFeed
      key={locale}
      initial={initial}
      locale={locale}
      labels={{ loading: t('loading'), more: t('showMore'), empty: t('empty') }}
      lightboxLabels={{
        close: viewer('close'),
        previous: viewer('previous'),
        next: viewer('next'),
        zoom: viewer('zoom'),
        error: viewer('error')
      }}
    />
  )
}

export default async function Gallery({ params }: PageProps<'/[locale]/gallery'>) {
  const [{ locale }, t, contact] = await Promise.all([params, getTranslations('galleryPage'), getTranslations('homePage.contactsSection')])
  if (!hasLocale(routing.locales, locale)) notFound()

  return (
    <main className="bg-zinc-950 text-white">
      <GalleryHero />
      <section id="gallery" aria-label={t('viewWorks')} className="scroll-mt-16">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container py-10 sm:py-14">
          <Suspense fallback={<div role="status" aria-label={t('loading')}><GalleryGridSkeleton /></div>}>
            <GalleryPhotos locale={locale} />
          </Suspense>
        </FadeContent>
      </section>
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
        <FaqSection titleId="gallery-faq-title" title={t('faq.title')} items={t.raw('faq.items')} className="py-16 lg:py-20" />
      </FadeContent>
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
        <ContactsSection title={<FoldText text={contact('title')} />} />
      </FadeContent>
    </main>
  )
}
