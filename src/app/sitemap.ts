import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getBlogPostsForSitemap } from '@/lib/cachedPrisma'
import { buildLanguageAlternates, localizedUrl } from '@/lib/siteUrl'

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
    ...routing.locales.map(locale => ({
      url: localizedUrl(locale, '/blog'),
      alternates: { languages: buildLanguageAlternates('/blog') },
      changeFrequency: 'weekly' as const,
      priority: 0.6
    })),
    ...blogPosts.flatMap(post => {
      const path = `/blog/${post.slug}`
      const languages = buildLanguageAlternates(path, post.locales)
      return post.locales.map(locale => ({
        url: localizedUrl(locale, path),
        alternates: { languages },
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5
      }))
    })
  ]
}
