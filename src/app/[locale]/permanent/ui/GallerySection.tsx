import { Expand } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { CtaLink } from '@/components/ui/cta-link'
import { Skeleton } from '@/components/ui/skeleton'
import { getPathname } from '@/i18n/navigation'
import { getPermanentImages } from '@/lib/cachedPrisma'
import { SUPABASE_S3_URL } from '@/lib/config'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import Lightbox from '@/shared/Lightbox'

export const GallerySection = async () => {
  const t = await getTranslations('permanentPage.gallerySection')

  const locale = await getLocale()
  const descriptions = t.raw('photos') as Record<string, string>
  const images = await getPermanentImages()
  const hasEditorialLayout = images.length === 5

  return (
    <section className="bg-zinc-900 pt-14 pb-20 lg:pt-20">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container grid gap-5 sm:gap-6">
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex max-w-xl flex-col gap-2">
            <h2 className="text-3xl leading-tight font-bold tracking-tight text-white lg:text-4xl">
              <FoldText text={t('title')} />
            </h2>
            <p className="leading-relaxed text-zinc-300">{t('text')}</p>
          </div>
          <CtaLink href={getPathname({ locale, href: '/gallery' })} className="before:hidden hover:bg-red-700 md:shrink-0">
            {t('link')}
          </CtaLink>
        </header>

        <Lightbox gallery="gallery-permanent">
          <div
            id="gallery-permanent"
            className={`grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 ${hasEditorialLayout ? 'md:grid-cols-12 md:grid-rows-2' : 'md:grid-cols-4'}`}
          >
            {images.map((photo, index) => {
              const alt =
                descriptions[
                  photo.url
                    .split('/')
                    .pop()
                    ?.replace(/\.webp$/, '') ?? ''
                ] ?? photo.alt
              const src = `${SUPABASE_S3_URL}/${photo.url}`
              const isLead = hasEditorialLayout && index === 0
              let frameClass = 'aspect-3/4'
              let sizes = '(min-width: 768px) 25vw, 50vw'

              if (isLead) {
                frameClass = 'col-span-2 aspect-5/4 md:col-span-5 md:row-span-2 md:aspect-square'
                sizes = '(min-width: 1536px) 618px, (min-width: 768px) 42vw, calc(100vw - 32px)'
              } else if (hasEditorialLayout && (index === 1 || index === 4)) {
                frameClass = 'aspect-4/5 md:col-span-4 md:aspect-auto'
                sizes = '(min-width: 1536px) 491px, (min-width: 768px) 33vw, 50vw'
              } else if (hasEditorialLayout) {
                frameClass = 'aspect-4/5 md:col-span-3 md:aspect-auto'
                sizes = '(min-width: 1536px) 364px, (min-width: 768px) 25vw, 50vw'
              }

              return (
                <a
                  key={photo.id}
                  className={`group relative block cursor-zoom-in overflow-hidden rounded-sm bg-zinc-800 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 ${frameClass}`}
                  href={src}
                  data-gtm="permanent-gallery-image-open"
                  data-pswp-width={1200}
                  data-pswp-height={1600}
                  aria-label={alt}
                >
                  <Image
                    className={`object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-105 ${isLead ? 'object-top' : ''}`}
                    src={src}
                    fill
                    sizes={sizes}
                    fetchPriority="low"
                    alt={alt}
                  />
                  <Expand
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 bottom-2 size-8 rounded-full bg-zinc-950/75 p-2 text-white group-hover:bg-zinc-950 sm:right-3 sm:bottom-3"
                  />
                </a>
              )
            })}
          </div>
        </Lightbox>
      </FadeContent>
    </section>
  )
}

export const GallerySectionFallback = () => (
  <section className="bg-zinc-900 pt-14 pb-20 lg:pt-20" aria-hidden="true">
    <div className="container grid gap-5 sm:gap-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex w-full max-w-xl flex-col gap-2">
          <Skeleton className="h-9 w-full max-w-64 bg-zinc-800 motion-reduce:animate-none lg:h-10" />
          <Skeleton className="h-18 w-full bg-zinc-800 motion-reduce:animate-none sm:h-12 md:h-18 lg:h-12" />
        </div>
        <Skeleton className="h-12 w-60 max-w-full bg-zinc-800 motion-reduce:animate-none md:shrink-0" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-12 md:grid-rows-2 lg:gap-4">
        {[
          'col-span-2 aspect-5/4 md:col-span-5 md:row-span-2 md:aspect-square',
          'aspect-4/5 md:col-span-4 md:aspect-auto',
          'aspect-4/5 md:col-span-3 md:aspect-auto',
          'aspect-4/5 md:col-span-3 md:aspect-auto',
          'aspect-4/5 md:col-span-4 md:aspect-auto'
        ].map((className, index) => (
          <Skeleton key={index} className={`rounded-sm bg-zinc-800 motion-reduce:animate-none ${className}`} />
        ))}
      </div>
    </div>
  </section>
)
