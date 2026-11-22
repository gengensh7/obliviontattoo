'use client'

import type { MouseEvent, ReactNode } from 'react'
import { scroller } from 'react-scroll'
import { CtaLink } from '@/components/ui/cta-link'

export function ScrollCtaLink({ children, targetId, className }: { children: ReactNode; targetId: string; className?: string }) {
  const href = `#${targetId}`

  function scrollToTarget(event: MouseEvent<HTMLAnchorElement>) {
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
    <CtaLink href={href} onClick={scrollToTarget} className={className}>
      {children}
    </CtaLink>
  )
}
