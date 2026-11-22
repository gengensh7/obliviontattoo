import type { AppLocale } from '@/i18n/routing'
import { blogAvailabilitySelect, blogFields, blogLocales, selectBlogText } from '@/lib/blogFields'
import { postExcerpt, postPreview } from '@/lib/postExcerpt'
import { type BlogPost, ImageType } from '@/generated/prisma/client'
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

function localizedPost(row: Partial<BlogPost>, locale: AppLocale) {
  const fields = blogFields(locale)
  const title = row[fields.title]
  const content = row[fields.content]
  if (!title?.trim() || !content?.trim()) return null

  const excerpt = row[fields.excerpt] ?? postExcerpt(content)
  return {
    title, content, excerpt,
    seoTitle: row[fields.seoTitle] ?? title,
    seoDescription: row[fields.seoDescription] ?? excerpt
  }
}

export async function getBlogPost(slug: string, locale: AppLocale) {
  'use cache'
  cacheLife('days')
  cacheTag('blog-posts')

  const post = await prisma.blogPost.findUnique({
    where: { slug: slug.toLowerCase(), isPublished: true },
    select: { slug: true, createdAt: true, updatedAt: true, ...blogAvailabilitySelect, ...selectBlogText(Object.values(blogFields(locale))) }
  })
  if (!post) return null
  const translation = localizedPost(post, locale)
  return translation && {
    ...translation, slug: post.slug, createdAt: post.createdAt, updatedAt: post.updatedAt, locales: blogLocales(post)
  }
}

export async function getBlogPosts(locale: AppLocale) {
  'use cache'
  cacheLife('days')
  cacheTag('blog-posts')

  const fields = blogFields(locale)
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, createdAt: true, ...selectBlogText([fields.title, fields.excerpt, fields.content]) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
  })
  return posts.flatMap(post => {
    const title = post[fields.title]
    const content = post[fields.content]
    if (!title?.trim() || !content?.trim()) return []
    const preview = postPreview(content)
    return [{ slug: post.slug, createdAt: post.createdAt, title, cover: preview.cover, excerpt: post[fields.excerpt] ?? preview.excerpt }]
  })
}

export async function getBlogPostsForSitemap() {
  'use cache'
  cacheLife('days')
  cacheTag('blog-posts')

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true, ...blogAvailabilitySelect },
    orderBy: { id: 'desc' }
  })
  return posts.map(post => ({ slug: post.slug, updatedAt: post.updatedAt, locales: blogLocales(post) }))
}
