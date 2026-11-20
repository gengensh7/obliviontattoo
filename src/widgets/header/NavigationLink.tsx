'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import { getPathname } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'
import GooeyNav from './GooeyNav'

type Props = {
  locale: string
  links: { label: string; href: string }[]
}

export default function NavigationLink({ locale, links }: Props) {
  const segment = useSelectedLayoutSegment()
  const items = links
    .filter(({ href }) => locale === routing.defaultLocale || !href.startsWith('/blog'))
    .map(({ label, href }) => ({
      label,
      destination: href,
      href: getPathname({ locale: locale as AppLocale, href })
    }))
  const activeIndex = items.findIndex(({ destination }) => destination === `/${segment}`)

  return <GooeyNav items={items} activeIndex={activeIndex} />
}
