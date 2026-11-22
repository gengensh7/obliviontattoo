import { hasLocale } from 'next-intl'
import type { NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { getGalleryImages } from '@/lib/galleryImages'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const locale = query.get('locale')
  const cursor = /^(-?\d{1,10}):([1-9]\d{0,9})$/.exec(query.get('cursor') ?? '')
  if (!hasLocale(routing.locales, locale) || !cursor) {
    return Response.json({ error: 'Invalid locale or cursor' }, { status: 400 })
  }

  const order = Number(cursor[1])
  const id = Number(cursor[2])
  if (order < -2147483648 || order > 2147483647 || id > 2147483647) {
    return Response.json({ error: 'Invalid cursor' }, { status: 400 })
  }

  return Response.json(await getGalleryImages(locale, { order, id }))
}
