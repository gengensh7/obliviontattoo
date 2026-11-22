import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getBlogPost } from '@/lib/cachedPrisma'
import type { AppLocale } from '@/i18n/routing'
import { buildLanguageAlternates, localizedUrl, siteOrigin } from '@/lib/siteUrl'

const baseMetadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: 'Oblivion Tattoo',
  robots: { index: true, follow: true }
}

const socialLocales: Record<string, string> = {
  ru: 'ru_RU', ro: 'ro_MD', uk: 'uk_UA', it: 'it_IT', en: 'en_GB'
}

type SocialMetadataOptions = {
  locale: string
  type: 'website' | 'article'
  url: string
  openGraphTitle: string
  openGraphDescription?: string
  twitterTitle?: string
  twitterDescription?: string
  image?: string
}

function buildSocialMetadata({ locale, type, url, openGraphTitle, openGraphDescription, twitterTitle, twitterDescription, image }: SocialMetadataOptions) {
  const images = image ? [{ url: image, width: 1200, height: 630, alt: openGraphTitle }] : undefined
  const description = openGraphDescription ?? twitterDescription
  const twitterDescriptionValue = twitterDescription ?? description

  return {
    openGraph: {
      type,
      url,
      locale: socialLocales[locale],
      siteName: 'Oblivion Tattoo',
      title: openGraphTitle,
      ...(description ? { description } : {}),
      ...(images ? { images } : {})
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: twitterTitle ?? openGraphTitle,
      ...(twitterDescriptionValue ? { description: twitterDescriptionValue } : {}),
      ...(image ? { images: [image] } : {})
    }
  }
}

type BuildMetadataOptions = {
  locale: Locale
  namespace: string
  path?: string
  alternateLocales?: readonly string[]
  pageNumber?: number
}

export async function buildMetadata({ locale, namespace, path, alternateLocales, pageNumber }: BuildMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })
  const pageLabel = pageNumber && pageNumber > 1 ? t('pageLabel', { page: pageNumber }) : ''
  const localizedText = (key: string) => pageLabel ? `${t(key)} — ${pageLabel}` : t(key)
  const title = localizedText('title')
  const description = localizedText('description')
  const canonicalUrl = localizedUrl(locale, path)
  const image = `${siteOrigin}/og_image.png`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: buildLanguageAlternates(path, alternateLocales) },
    ...buildSocialMetadata({
      locale,
      type: 'website',
      url: canonicalUrl,
      openGraphTitle: t.has('openGraphTitle') ? localizedText('openGraphTitle') : title,
      openGraphDescription: t.has('openGraphDescription') ? localizedText('openGraphDescription') : description,
      twitterTitle: t.has('twitterTitle') ? localizedText('twitterTitle') : title,
      twitterDescription: t.has('twitterDescription') ? localizedText('twitterDescription') : description,
      image
    })
  }
}

export function withSeo(namespace: string, path?: string, alternateLocales?: readonly string[]) {
  return async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params
    return buildMetadata({ locale, namespace, path, alternateLocales })
  }
}

type BuildBlogPostMetadataParams = { locale: AppLocale; slug: string }

export async function buildBlogPostMetadata({ locale, slug }: BuildBlogPostMetadataParams): Promise<Metadata> {
  const post = await getBlogPost(slug, locale)
  if (!post) notFound()

  const path = `/blog/${post.slug}`
  const canonicalUrl = localizedUrl(locale, path)

  return {
    ...baseMetadata,
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: canonicalUrl, languages: buildLanguageAlternates(path, post.locales) },
    ...buildSocialMetadata({
      locale,
      type: 'article',
      url: canonicalUrl,
      openGraphTitle: post.seoTitle,
      openGraphDescription: post.seoDescription,
      image: `${siteOrigin}/og_image.png`
    })
  }
}
