import { routing, type AppLocale } from '@/i18n/routing'

const suffixes = { ru: '', ro: 'Ro', uk: 'Uk', it: 'It', en: 'En' } as const satisfies Record<AppLocale, string>

export function blogFields(locale: AppLocale) {
  const suffix = suffixes[locale]
  return {
    title: `title${suffix}`,
    excerpt: `excerpt${suffix}`,
    content: `content${suffix}`,
    seoTitle: `seoTitle${suffix}`,
    seoDescription: `seoDescription${suffix}`
  } as const
}

type BlogFields = ReturnType<typeof blogFields>
export type BlogTextColumn = BlogFields[keyof BlogFields]

export function selectBlogText(columns: BlogTextColumn[]): Partial<Record<BlogTextColumn, true>> {
  return Object.fromEntries(columns.map(field => [field, true]))
}

export const blogAvailabilitySelect = { title: true, content: true, titleRo: true, titleUk: true, titleIt: true, titleEn: true } as const

// Only the translated columns have a database constraint requiring a complete translation.
export function blogLocales(post: Record<keyof typeof blogAvailabilitySelect, string | null>) {
  return routing.locales.filter(locale =>
    post[blogFields(locale).title]?.trim() && (locale !== routing.defaultLocale || post.content?.trim())
  )
}
