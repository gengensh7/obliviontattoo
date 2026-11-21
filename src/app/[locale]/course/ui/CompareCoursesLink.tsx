'use client'

import type { MouseEvent } from 'react'
import { scroller } from 'react-scroll'
import { CtaLink } from '@/components/ui/cta-link'

export function CompareCoursesLink({ label, targetId }: { label: string; targetId: string }) {
  const href = `#${targetId}`

  function scrollToComparison(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = document.getElementById(targetId)
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()
    if (window.location.hash !== href) window.history.pushState(null, '', href)

    const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
    target.focus({ preventScroll: true })
    scroller.scrollTo(targetId, { duration: 550, smooth: 'easeInOutCubic', offset: -scrollMargin })
  }

  return (
    <CtaLink href={href} onClick={scrollToComparison} className="grow px-3 sm:grow-0 sm:px-5">
      {label}
    </CtaLink>
  )
}
