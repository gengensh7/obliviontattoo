import { routing } from '@/i18n/routing'

const domain = process.env.NEXT_PUBLIC_DOMAIN_URL
if (!domain) throw new Error('NEXT_PUBLIC_DOMAIN_URL is required')

export const siteOrigin = new URL(domain).origin

export function localizedUrl(locale: string, path = '') {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${siteOrigin}${prefix}${path}`
}
