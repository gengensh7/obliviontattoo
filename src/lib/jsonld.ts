import { getTranslations } from 'next-intl/server'
import { courses } from '@/lib/courses'
import { CONTACT_INSTAGRAM, CONTACT_PHONE_NUMBER, CONTACT_TELEGRAM, LOCATION_GOOGLE_MAPS } from '@/lib/contactLinks'
import { localizedUrl, siteOrigin } from '@/lib/siteUrl'

const businessId = `${siteOrigin}/#tattoo-parlor`

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TattooParlor'],
    '@id': businessId,
    name: 'Oblivion Tattoo',
    image: `${siteOrigin}/og_image.png`,
    logo: `${siteOrigin}/logo.png`,
    url: siteOrigin,
    hasMap: LOCATION_GOOGLE_MAPS,
    telephone: CONTACT_PHONE_NUMBER,
    sameAs: [CONTACT_INSTAGRAM, CONTACT_TELEGRAM],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '20:30'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'str. Tighina 65',
      addressLocality: 'Chișinău',
      addressRegion: 'Chișinău',
      postalCode: 'MD-2001',
      addressCountry: 'MD'
    }
  }
}

type ServiceOffer = {
  price?: number
  priceCurrency: string
  lowPrice?: number
  highPrice?: number
}

function buildServiceJsonLd(locale: string, path: string, name: string, description: string, offer?: ServiceOffer) {
  const url = localizedUrl(locale, path)
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    url,
    provider: { '@id': businessId },
    areaServed: { '@type': 'City', name: 'Chișinău' }
  }

  if (!offer) return service

  const { price, priceCurrency, lowPrice, highPrice } = offer
  const offers = lowPrice !== undefined && highPrice !== undefined
    ? { '@type': 'AggregateOffer', priceCurrency, lowPrice, highPrice, url }
    : { '@type': 'Offer', price, priceCurrency, url }

  return { ...service, offers }
}

export async function buildTattooServiceJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: 'tattooPage' })
  return buildServiceJsonLd(locale, '/tattoo', t('tattoo.serviceType'), t('heroSection.subtitle'), {
    priceCurrency: 'MDL',
    lowPrice: 400,
    highPrice: 4000
  })
}

export async function buildPiercingServiceJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: 'piercingPage' })
  return buildServiceJsonLd(locale, '/piercing', t('piercing.serviceType'), t('heroSection.text'), {
    priceCurrency: 'MDL',
    lowPrice: 150,
    highPrice: 600
  })
}

export async function buildPermanentMakeupServiceJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: 'permanentPage' })
  const service = buildServiceJsonLd(locale, '/permanent', t('pm.serviceType'), t('descriptionSection.text'))
  const items = t.raw('serviceSection.services') as { id: string; title: string }[]
  return {
    ...service,
    offers: items.map(({ id, title }) => ({
      '@type': 'Offer',
      name: title,
      price: 900,
      priceCurrency: 'MDL',
      url: `${service.url}#${id}`
    }))
  }
}

export async function buildCoursesJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: 'coursesPage.types' })
  return courses.map(({ key, price }) => {
    const url = localizedUrl(locale, `/course#${key}-course`)
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': url,
      url,
      name: t(`${key}.title`),
      description: t(`${key}.text`),
      provider: { '@id': businessId },
      offers: { '@type': 'Offer', price, priceCurrency: 'EUR', url }
    }
  })
}

type BlogPostJsonLdProps = {
  title: string
  slug: string
  locale: string
  description?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export function buildBlogPostJsonLd({ title, slug, locale, description, image, createdAt, updatedAt }: BlogPostJsonLdProps) {
  const url = localizedUrl(locale, `/blog/${slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#blog-post`,
    headline: title,
    url,
    inLanguage: locale,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(createdAt ? { datePublished: createdAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    author: { '@id': businessId },
    publisher: { '@id': businessId }
  }
}
