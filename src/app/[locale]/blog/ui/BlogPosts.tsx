import { getTranslations } from 'next-intl/server'
import { getBlogPosts } from '@/lib/cachedPrisma'
import { getPathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { ArticleCard } from './ArticleCard'
import { SearchableArticles } from './SearchableArticles'

export async function BlogPosts({ locale }: { locale: AppLocale }) {
  const [posts, t] = await Promise.all([getBlogPosts(locale), getTranslations('blogPage')])
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Europe/Chisinau' })
  const articles = posts.map(post => ({
    title: post.title,
    slug: post.slug,
    href: getPathname({ locale, href: `/blog/${post.slug}` }),
    excerpt: post.excerpt,
    cover: post.cover,
    dateTime: post.createdAt.toISOString(),
    dateLabel: date.format(post.createdAt)
  }))
  const labels = { featured: t('featured'), read: t('read') }

  if (!articles.length) return <p className="text-zinc-300">{t('empty')}</p>
  if (articles.length === 1) return <ArticleCard article={articles[0]} labels={labels} featured />

  return (
    <SearchableArticles articles={articles}
      labels={{ ...labels, search: t('search'), noResults: t('noResults'), clear: t('clear') }} />
  )
}
