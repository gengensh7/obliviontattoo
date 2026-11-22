'use client'

import { Suspense } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import { getPathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import GooeyNav, { type GooeyNavItem } from './GooeyNav'

type Props = {
  locale: string
  links: { label: string; href: string }[]
  courseLinks: GooeyNavItem[]
}

function ActiveNavigation({ items, courseLinks }: { items: GooeyNavItem[]; courseLinks: GooeyNavItem[] }) {
  const segments = useSelectedLayoutSegments().filter((segment) => !segment.startsWith('('))
  const activeIndex = items.findIndex(({ destination }) => destination === `/${segments[0]}`)
  const activeCoursePath = segments[0] === 'course' ? `/${segments.join('/')}` : undefined
  return <GooeyNav items={items} activeIndex={activeIndex} courseLinks={courseLinks} activeCoursePath={activeCoursePath} />
}

export default function NavigationLink({ locale, links, courseLinks }: Props) {
  const items = links.map(({ label, href }) => ({
    label,
    destination: href,
    href: getPathname({ locale: locale as AppLocale, href })
  }))

  return (
    <Suspense fallback={<GooeyNav items={items} activeIndex={-1} courseLinks={courseLinks} />}>
      <ActiveNavigation items={items} courseLinks={courseLinks} />
    </Suspense>
  )
}
