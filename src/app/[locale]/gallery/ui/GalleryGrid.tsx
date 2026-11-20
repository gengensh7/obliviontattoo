import { getLocale, getTranslations } from 'next-intl/server'
import { getPathname } from '@/i18n/navigation'
import { GALLERY_PAGE_SIZE } from '@/lib/cachedPrisma'
import { Expand } from 'lucide-react'
import NextImage from 'next/image'
import { getPaginatedImages } from '@/lib/paginationPrisma'
import Lightbox from '@/shared/Lightbox'
import NuqsPagination from '@/shared/NuqsPagination'

export async function GalleryGrid({ page }: { page: number }) {
  const [locale, { items, totalPages }] = await Promise.all([getLocale(), getPaginatedImages(page)])
  const t = await getTranslations('galleryPage.pagination')
  const labels = { nav: t('label'), previous: t('previous'), next: t('next') }
  const imageSlots = [...items, ...Array(Math.max(0, GALLERY_PAGE_SIZE - items.length)).fill(null)]
  const supabaseS3Url = process.env.NEXT_PUBLIC_SUPABASE_URL_S3

  return (
    <>
      <Lightbox gallery="gallery-portfolio">
        <div id="gallery-portfolio" className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {imageSlots.map((photo, index) =>
            photo ? (
              <div key={photo.id}>
                <a className="relative block h-105 w-full overflow-hidden" href={`${supabaseS3Url}/${photo.url}`} data-gtm="gallery-image-open" data-pswp-width={1200} data-pswp-height={1600} aria-label={photo.alt}>
                  <NextImage
                    className="rounded-md object-cover"
                    src={`${supabaseS3Url}/${photo.url}`}
                    fill
                    preload={index === 0}
                    sizes="(min-width: 1536px) 346px, (min-width: 1280px) 282px, (min-width: 1024px) 218px, (min-width: 768px) 348px, (min-width: 640px) 284px, calc(100vw - 32px)"
                    alt={photo.alt}
                  />
                  <Expand className="pointer-events-none absolute right-3 bottom-3 size-10 rounded-full bg-zinc-900/70 p-2 text-white shadow-lg backdrop-blur-sm" />
                </a>
              </div>
            ) : (
              <div className="h-105" key={`empty-${index}`} />
            )
          )}
        </div>
      </Lightbox>

      {totalPages > 1 && <NuqsPagination labels={labels} basePath={getPathname({ locale, href: '/gallery' })} totalPages={totalPages} />}
    </>
  )
}
