'use client'

import { Suspense } from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import { getPathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import GooeyNav, { type GooeyNavItem } from './GooeyNav'

type Props = {
  locale: string
  links: { label: string; href: string }[]
}

function ActiveNavigation({ items }: { items: GooeyNavItem[] }) {
  const segment = useSelectedLayoutSegment()
  const activeIndex = items.findIndex(({ destination }) => destination === `/${segment}`)
  return <GooeyNav items={items} activeIndex={activeIndex} />
}

export default function NavigationLink({ locale, links }: Props) {
  const items = links.map(({ label, href }) => ({
    label,
    destination: href,
    href: getPathname({ locale: locale as AppLocale, href })
  }))

  return (
    <Suspense fallback={<GooeyNav items={items} activeIndex={-1} />}>
      <ActiveNavigation items={items} />
    </Suspense>
  )
}
