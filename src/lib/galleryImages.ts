import { cacheLife, cacheTag } from 'next/cache'
import type { AppLocale } from '@/i18n/routing'
import { SUPABASE_S3_URL } from '@/lib/config'
import prisma from '@/lib/prisma'

type GalleryCursor = { order: number; id: number }

export async function getGalleryImages(locale: AppLocale, after?: GalleryCursor) {
  'use cache'
  cacheLife('hours')
  cacheTag('images')

  const size = 6
  const rows = await prisma.image.findMany({
    where: after && { OR: [{ order: { gt: after.order } }, { order: after.order, id: { gt: after.id } }] },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    take: size + 1,
    select: { id: true, order: true, url: true, alt: true, altRo: true, altUk: true, altIt: true, altEn: true }
  })
  const last = rows[size - 1]
  return {
    items: rows.slice(0, size).map(({ id, url, alt, altRo, altUk, altIt, altEn }) => ({
      id,
      src: `${SUPABASE_S3_URL}/${url}`,
      alt: ({ ru: alt, ro: altRo, uk: altUk, it: altIt, en: altEn })[locale]?.trim() || alt
    })),
    nextCursor: rows.length > size ? `${last.order}:${last.id}` : null
  }
}

export type GalleryBatch = Awaited<ReturnType<typeof getGalleryImages>>
