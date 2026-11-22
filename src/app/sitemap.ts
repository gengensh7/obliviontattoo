import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getBlogPostsForSitemap } from '@/lib/cachedPrisma'
import { localizedUrl, siteOrigin } from '@/lib/siteUrl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPostsForSitemap()
  const publicPaths = ['', '/tattoo', '/piercing', '/course', '/permanent', '/gallery', '/contacts']
  const pages = routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: localizedUrl(locale, path),
      changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
      priority: path === '' ? 1 : 0.8
    }))
  )

  return [
    ...pages,
    {
      url: `${siteOrigin}/blog`,
      changeFrequency: 'weekly',
      priority: 0.6
    },
    ...blogPosts.map((post) => ({
      url: `${siteOrigin}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5
    }))
  ]
}
