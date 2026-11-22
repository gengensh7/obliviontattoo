import { Suspense } from 'react'
import Image, { getImageProps } from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { LoadingStatus, SkeletonBlock } from '@/shared/LoadingSkeleton'
import { getPathname } from '@/i18n/navigation'
import { getLatestTattooImages } from '@/lib/cachedPrisma'
import { SUPABASE_S3_URL } from '@/lib/config'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { TattooCircularGallery } from './TattooCircularGallery'

const titleId = 'tattoo-portfolio-title'

function TattooPhotosFallback() {
  return (
    <>
      <LoadingStatus />
      <div className="flex h-96 items-center justify-center gap-5 overflow-hidden sm:h-112 lg:h-134 xl:h-148">
        <SkeletonBlock className="hidden h-4/5 w-64 shrink-0 rounded-xl sm:block lg:w-80" />
        <SkeletonBlock className="h-4/5 w-56 shrink-0 rounded-xl sm:w-64 lg:w-80" />
        <SkeletonBlock className="hidden h-4/5 w-64 shrink-0 rounded-xl sm:block lg:w-80" />
      </div>
    </>
  )
}

async function TattooPhotos() {
  const [images, common] = await Promise.all([
    getLatestTattooImages(),
    getTranslations('homePage.portfolioSection')
  ])
  if (!images.length) return null

  const photos = images.map(({ id, url, alt }) => ({ id, src: `${SUPABASE_S3_URL}/${url}`, alt }))

  return (
    <TattooCircularGallery
      items={photos.map(({ src, alt }) => ({
        image: getImageProps({ src, alt, width: 320, height: 427, quality: 70 }).props.src,
        alt
      }))}
      titleId={titleId}
      labels={{
        close: common('close'),
        previous: common('previous'),
        next: common('next'),
        zoom: common('zoom'),
        error: common('error')
      }}
    >
      {photos.map(({ id, src, alt }) => (
        <a
          key={id}
          href={src}
          aria-label={alt}
          data-gtm="tattoo-image-open"
          data-pswp-width={1200}
          data-pswp-height={1600}
          className="relative block h-4/5 w-56 shrink-0 snap-center overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red sm:w-64 lg:w-80"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 256px, 224px"
            quality={70}
            fetchPriority="low"
            className="object-cover"
          />
        </a>
      ))}
    </TattooCircularGallery>
  )
}

export const LatestTattoo = async () => {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('tattooPage.latestTattooSection')])

  return (
    <section aria-labelledby={titleId} className="bg-linear-to-b from-zinc-950 to-zinc-900 text-white">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col gap-7 pt-16 pb-12 lg:gap-10 lg:pt-20">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-3 lg:basis-3/5">
            <h2 id={titleId} className="text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
              <FoldText text={t('title')} />
            </h2>
            <p className="text-pretty text-zinc-300">{t('description')}</p>
          </div>
          <CtaLink href={getPathname({ locale, href: '/gallery' })} data-gtm="tattoo-view-gallery" className="shrink-0">
            {t('cta')}
          </CtaLink>
        </div>
        <Suspense fallback={<TattooPhotosFallback />}>
          <TattooPhotos />
        </Suspense>
      </FadeContent>
    </section>
  )
}
