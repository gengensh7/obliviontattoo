'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import GlassSurface from './GlassSurface'

type Props = {
  children: ReactNode
}

export const HeaderScrollWrapper = ({ children }: Props) => {
  const scrollMarker = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!scrollMarker.current) return

    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting))
    observer.observe(scrollMarker.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={scrollMarker} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-2.5 w-px" />
      <header className="group/header fixed top-0 z-50 w-full" data-scrolled={isScrolled ? '' : undefined}>
        <div className="container relative mx-auto px-4 py-2">
          <GlassSurface visible={isScrolled} />
          <div className="relative flex items-center justify-between">{children}</div>
        </div>
      </header>
    </>
  )
}
