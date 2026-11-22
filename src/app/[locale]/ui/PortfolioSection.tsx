import { Suspense } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import { getPortfolioImages } from '@/lib/cachedPrisma'
import { SUPABASE_S3_URL } from '@/lib/config'
import FadeContent from '@/shared/FadeContent'
import { LoadingStatus, SkeletonBlock } from '@/shared/LoadingSkeleton'
import FoldText from '@/shared/FoldText'
import PortfolioMasonry, { type PortfolioPhoto } from './PortfolioMasonry'

// Keep the dimensions and small blur previews of the current Supabase originals together.
const portfolioPreviews: Record<string, Pick<PortfolioPhoto, 'dimensions' | 'blurDataURL'>> = {
  'Permanent/permanent-1.webp': {
    dimensions: { width: 1240, height: 1754 },
    blurDataURL: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoGAAgAAwBUJZACdADcYrOkEADeGxETJcXB4aAvrTl7S797jCmGsIpFFiqHvSy3DOyNaGUicwAAAA=='
  },
  'Piercing/piercing-1.webp': {
    dimensions: { width: 1024, height: 1024 },
    blurDataURL: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoIAAgAAwBUJbACdAD0mjJw+kAAAPw8fctqWVR4uT4JuvEsN1WfFJYm+lp6SLSrSbdWvtd9d996S+erdg6YAAAA'
  },
  'Portfolio/IMG_20250914_133848.webp': {
    dimensions: { width: 960, height: 1280 },
    blurDataURL: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoGAAgAAwBUJZACdAEXfq87uYAA/soxstSWizR32r/h2zZV39906WtKCzaNxndJdLqWYqLgXJJ3EnW7hgAAAA=='
  },
  'Permanent/permanent-2.webp': {
    dimensions: { width: 1024, height: 1162 },
    blurDataURL: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoHAAgAAwBUJQBOgCPQTUi2LEQA/OAcJOcSrhRwvkk7enE2EBbfSCOJ7Je5aKQ5aiSUAAAA'
  },
  'Piercing/piercing-2.webp': {
    dimensions: { width: 1024, height: 1024 },
    blurDataURL: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoIAAgAAwBUJaACdAD0rWYSdYAA/pUFYrlEQ+NQU5JuyhtyF4jbiaTXDFo3xKKYVnXrS2mSZ7UyCel9jcQAAA=='
  },
  'Portfolio/IMG_20250914_133923.webp': {
    dimensions: { width: 960, height: 1280 },
    blurDataURL: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoGAAgAAwBUJQBOgCLv0GE3IAD81qvzm9gg05MIddKgm143WJtJBEpLocgi4VxTtBW7vzzNsoAAAA=='
  }
}

function PortfolioPhotosSkeleton() {
  return (
    <>
      <LoadingStatus />
      <div aria-hidden="true" className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {['aspect-5/7', 'aspect-3/4', 'aspect-3/4', 'aspect-7/8', 'aspect-square', 'aspect-square'].map((ratio, index) => (
          <div key={index} className="break-inside-avoid pb-4">
            <SkeletonBlock className={ratio} />
          </div>
        ))}
      </div>
    </>
  )
}

async function PortfolioPhotos() {
  const [images, t] = await Promise.all([getPortfolioImages(), getTranslations('homePage.portfolioSection')])
  return images.length > 0 && (
    <PortfolioMasonry
      photos={images.map(({ id, url, alt }) => ({
        id,
        alt,
        src: `${SUPABASE_S3_URL}/${url}`,
        ...portfolioPreviews[url]
      }))}
      openLabel={t('linkLabel')}
      lightboxLabels={{
        close: t('close'),
        previous: t('previous'),
        next: t('next'),
        zoom: t('zoom'),
        error: t('error')
      }}
    />
  )
}

export const PortfolioSection = async () => {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('homePage.portfolioSection')])

  return (
    <section aria-labelledby="portfolio-title" className="bg-zinc-900 text-white">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col gap-8 py-16 lg:gap-10 lg:py-20">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-3 md:basis-2/3 lg:basis-1/2">
            <h2 id="portfolio-title" className="text-2xl font-semibold text-balance sm:text-3xl lg:text-4xl 2xl:text-5xl">
              <FoldText text={t('title')} />
            </h2>
            <p className="text-pretty text-zinc-300">{t('text')}</p>
          </div>
          <CtaLink href={getPathname({ locale, href: '/gallery' })} data-gtm="portfolio-view-gallery" className="shrink-0">
            {t('link')}
          </CtaLink>
        </div>
        <Suspense fallback={<PortfolioPhotosSkeleton />}>
          <PortfolioPhotos />
        </Suspense>
      </FadeContent>
    </section>
  )
}
