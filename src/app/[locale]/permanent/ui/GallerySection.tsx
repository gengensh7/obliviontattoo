import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'
import { Expand } from 'lucide-react'
import Image from 'next/image'
import { getPermanentImages } from '@/lib/cachedPrisma'
import { FramerMotionContainer } from '@/shared/FramerMotionContainer'
import Lightbox from '@/shared/Lightbox'
import { Skeleton } from '@/components/ui/skeleton'

const SUPABASE_S3_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_S3

export const GallerySection = async () => {
  const t = await getTranslations('permanentPage.gallerySection')

  const locale = await getLocale()
  const descriptions = t.raw('photos') as Record<string, string>
  const images = await getPermanentImages()

  return (
    <section className="bg-zinc-900 pb-20">
      <div className="container flex flex-col gap-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white 2xl:text-4xl">{t('title')}</h2>
          <p className="text-zinc-400">{t('text')}</p>
          <Link href={getPathname({ locale, href: '/gallery' })} className="text-rose-200 underline underline-offset-4">{t('link')}</Link>
        </div>

        <Lightbox gallery="gallery-permanent">
          <div id="gallery-permanent" className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {images.map((photo) => {
              const alt = descriptions[photo.url.split('/').pop()?.replace(/\.webp$/, '') ?? ''] ?? photo.alt
              return (
                <FramerMotionContainer key={photo.id}>
                  <a className="relative block h-105 w-full overflow-hidden" href={`${SUPABASE_S3_URL}/${photo.url}`} data-gtm="permanent-gallery-image-open" data-pswp-width={1200} data-pswp-height={1600} aria-label={alt}>
                    <Image
                      className="rounded-md object-cover"
                      src={`${SUPABASE_S3_URL}/${photo.url}`}
                      fill
                      sizes="(min-width: 1536px) 269px, (min-width: 1280px) 218px, (min-width: 1024px) 304px, (min-width: 768px) 219px, (min-width: 640px) 284px, calc(100vw - 32px)"
                      fetchPriority="low"
                      alt={alt}
                    />
                    <Expand className="pointer-events-none absolute right-3 bottom-3 size-10 rounded-full bg-zinc-900/70 p-2 text-white shadow-lg backdrop-blur-sm" />
                  </a>
                </FramerMotionContainer>
              )
            })}
          </div>
        </Lightbox>
      </div>
    </section>
  )
}

export const GallerySectionFallback = () => (
  <section className="bg-zinc-900 pb-20" aria-hidden="true">
    <div className="container flex flex-col gap-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
        <Skeleton className="h-8 w-64 bg-zinc-800" />
        <Skeleton className="h-5 w-full max-w-xl bg-zinc-800" />
        <Skeleton className="h-5 w-full max-w-lg bg-zinc-800" />
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {[...Array(6)].map((_, i) => <Skeleton className="h-100 w-full bg-zinc-800" key={i} />)}
      </div>
    </div>
  </section>
)
