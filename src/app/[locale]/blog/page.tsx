import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { CtaLink } from '@/components/ui/cta-link'
import type { AppLocale } from '@/i18n/routing'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import FadeContent from '@/shared/FadeContent'
import { FaqSection } from '@/shared/FaqSection'
import FoldText from '@/shared/FoldText'
import { BackgroundLines } from './ui/BackgroundLines'
import { BlogPosts } from './ui/BlogPosts'
import { FeaturedSkeleton } from './ui/FeaturedSkeleton'

export const generateMetadata = withSeo('metadata.blogPageMetadata', '/blog')

export default async function BlogPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const [t, contact] = await Promise.all([getTranslations('blogPage'), getTranslations('homePage.contactsSection')])

  return (
    <main className="bg-zinc-950 text-white">
      <section aria-labelledby="blog-title" className="relative isolate grid min-h-screen items-center overflow-hidden border-b border-white/15 bg-linear-to-br from-zinc-950 via-zinc-950 to-red-950/40 pt-32 pb-12 sm:pb-16">
        <BackgroundLines />
        <FadeContent effect="focus" trigger="mount" duration={0.52} initialOpacity={0.8}
          className="container grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
          <h1 id="blog-title" className="service-hero-title font-bold tracking-tight text-balance lg:col-span-7">
            <FoldText text={t('title')} />
          </h1>
          <div className="flex max-w-xl flex-col items-start gap-5 lg:col-span-5 lg:gap-6">
            <div className="grid gap-2">
              <p className="text-xl/snug text-balance text-white sm:text-2xl/snug">{t('lead')}</p>
              <p className="text-base/relaxed text-pretty text-zinc-300">{t('description')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CtaLink href="#articles">{t('browse')}</CtaLink>
              <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" target="_blank" rel="noopener noreferrer">
                {t('consult')}
              </CtaLink>
            </div>
          </div>
        </FadeContent>
      </section>
      <section id="articles" aria-labelledby="articles-title" className="scroll-mt-24">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container grid gap-6 py-10 sm:gap-8 sm:py-14 lg:pb-20">
          <h2 id="articles-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            <FoldText text={t('articles')} />
          </h2>
          <Suspense fallback={<FeaturedSkeleton />}>
            <BlogPosts locale={locale} />
          </Suspense>
        </FadeContent>
      </section>
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
        <FaqSection titleId="blog-faq-title" title={t('faq.title')} items={t.raw('faq.items')} className="py-16 lg:py-20" />
      </FadeContent>
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
        <ContactsSection title={<FoldText text={contact('title')} />} />
      </FadeContent>
    </main>
  )
}
