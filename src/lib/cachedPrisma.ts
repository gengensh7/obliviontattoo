import { ImageType } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { cacheLife, cacheTag } from 'next/cache'

export async function getSketchImages() {
  'use cache'

  cacheLife('hours')
  cacheTag('images')

  return prisma.image.findMany({ where: { type: ImageType.SKETCH }, orderBy: { order: 'asc' }, take: 6 })
}

export async function getPortfolioImages() {
  'use cache'

  cacheLife('hours')
  cacheTag('images')

  return prisma.image.findMany({
    where: { type: { not: ImageType.SKETCH } },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    take: 6
  })
}

export async function getLatestTattooImages() {
  'use cache'

  cacheLife('hours')
  cacheTag('images')

  return prisma.image.findMany({ where: { type: ImageType.PORTFOLIO }, orderBy: [{ order: 'asc' }, { id: 'asc' }], take: 8 })
}

export async function getPermanentImages() {
  'use cache'

  cacheLife('hours')
  cacheTag('images')

  return prisma.image.findMany({ where: { type: ImageType.PERMANENT }, orderBy: { order: 'asc' }, take: 6 })
}

export const GALLERY_PAGE_SIZE = 10

export async function getGalleryPageCount() {
  'use cache'

  cacheLife('hours')
  cacheTag('images')
  return Math.ceil(await prisma.image.count() / GALLERY_PAGE_SIZE)
}

export async function getPaginatedImagesCached(page: number) {
  'use cache'

  cacheLife('hours')
  cacheTag('images')
  return prisma.image.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    skip: (page - 1) * GALLERY_PAGE_SIZE,
    take: GALLERY_PAGE_SIZE
  })
}

export async function getBlogPost(slug: string) {
  'use cache'

  cacheLife('days')
  cacheTag('blog-posts')

  return prisma.blogPost.findUnique({ where: { slug: slug.toLowerCase() } })
}

export async function getBlogPosts() {
  'use cache'

  cacheLife('days')
  cacheTag('blog-posts')

  return prisma.blogPost.findMany({ orderBy: { id: 'desc' }, take: 9 })
}

export async function getBlogPostsForSitemap() {
  'use cache'

  cacheLife('days')
  cacheTag('blog-posts')

  return prisma.blogPost.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { id: 'desc' }
  })
}
