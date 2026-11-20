import { notFound } from 'next/navigation'
import { getGalleryPageCount, getPaginatedImagesCached } from '@/lib/cachedPrisma'

export async function resolveGalleryPage(value?: string | string[]) {
  if (value === undefined || value === '1') return 1
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) notFound()

  const page = Number(value)
  if (!Number.isSafeInteger(page) || page > await getGalleryPageCount()) notFound()
  return page
}

export async function getPaginatedImages(page: number) {
  const [items, totalPages] = await Promise.all([getPaginatedImagesCached(page), getGalleryPageCount()])
  return { items, totalPages }
}
