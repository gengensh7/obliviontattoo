import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getBlogPost, getBlogPosts } from '@/lib/cachedPrisma'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { buildBlogPostJsonLd } from '@/lib/jsonld'
import { buildBlogPostMetadata } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { prepareArticle } from './ui/prepareArticle'
import { TracingBeam } from './ui/TracingBeam'

type Props = { params: Promise<{ locale: AppLocale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildBlogPostMetadata(await params)
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)
  if (!post) notFound()

  const [t, contact, posts] = await Promise.all([
    getTranslations({ locale, namespace: 'blogPage' }),
    getTranslations({ locale, namespace: 'homePage.contactsSection' }),
    getBlogPosts(locale)
  ])
  const article = prepareArticle(post.content, post.excerpt)
  const related = posts.filter(other => other.slug !== post.slug).slice(0, 2)
  const blogHref = getPathname({ locale, href: '/blog' })
  const published = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Europe/Chisinau' })
  const linkStyle = 'inline-flex min-h-11 items-center gap-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red'

  return (
    <main className="roboto bg-zinc-950 text-zinc-100">
      <div className="container pt-24 pb-16 sm:pt-28 sm:pb-24">
        <article className="wrap-anywhere">
          <header className="grid grid-cols-1 gap-5 border-b border-zinc-800 pb-7 sm:gap-6 sm:pb-9">
            <nav aria-label={t('breadcrumbLabel')} className="text-sm text-zinc-400">
              <ol className="flex items-center gap-3">
                <li className="shrink-0"><Link href={blogHref} className={`${linkStyle} text-zinc-100 underline-offset-4 hover:underline`}>{t('blog')}</Link></li>
                <li aria-hidden="true" className="text-zinc-600">/</li>
                <li aria-current="page" className="truncate">{article.headingText || post.title}</li>
              </ol>
            </nav>
            <div className="grid gap-4 lg:w-5/6">
              <div className="text-3xl/tight font-bold tracking-tight text-balance text-white sm:text-4xl/tight lg:text-5xl/tight">
                {article.heading ?? <h1>{post.title}</h1>}
              </div>
              <div className="text-lg/7 text-pretty text-zinc-300 sm:text-xl/8">{article.description}</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
              <time dateTime={post.createdAt.toISOString()}>{published.format(post.createdAt)}</time>
              <span aria-hidden="true" className="h-3 w-px bg-zinc-700" />
              <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" className="size-3.5" />{t('readingTime', { minutes: article.minutes })}</span>
            </div>
            {article.cover && (
              <div className="article-cover">
                {article.openingImage ?? (
                  <div className="relative aspect-video overflow-hidden rounded-sm bg-zinc-900">
                    <Image src={article.cover.src} alt={article.cover.alt} fill sizes="(min-width: 1536px) 1536px, 100vw"
                      unoptimized={/^https?:/i.test(article.cover.src)} className="object-cover" />
                  </div>
                )}
              </div>
            )}
          </header>

          <section aria-label={article.headingText || post.title} className="py-10 sm:py-14">
            <TracingBeam className="pl-6 sm:pl-10">
              <div className="article-copy">{article.body}</div>
            </TracingBeam>
          </section>

          <footer className="grid gap-6 border-t border-zinc-800 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={blogHref} className={`${linkStyle} text-sm no-underline hover:text-brand-red`}>
                <ArrowLeft aria-hidden="true" className="size-4 text-brand-red" />{t('backToBlog')}
              </Link>
              <CtaLink href={CONTACT_TELEGRAM} target="_blank" rel="noopener noreferrer" data-gtm="blog-article-consult">
                {t('consult')}
              </CtaLink>
            </div>
            {related.length > 0 && (
              <nav aria-labelledby="related-articles" className="grid gap-1 border-t border-zinc-800 pt-5">
                <h2 id="related-articles" className="text-lg font-bold">{t('relatedArticles')}</h2>
                <ul>{related.map(other => (
                  <li key={other.slug}>
                    <Link href={getPathname({ locale, href: `/blog/${other.slug}` })} className={`${linkStyle} underline-offset-4 hover:underline`}>
                      {other.title}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
                    </Link>
                  </li>
                ))}</ul>
              </nav>
            )}
          </footer>
        </article>
      </div>
      <div className="bg-zinc-900 pt-16 lg:pt-20">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
          <ContactsSection title={<FoldText text={contact('title')} />} />
        </FadeContent>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBlogPostJsonLd({
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              locale,
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString()
            })
          ).replace(/</g, '\\u003c')
        }}
      />
    </main>
  )
}
