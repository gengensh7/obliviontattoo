'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

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
      <div ref={scrollMarker} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[10px] w-px" />
      <header
        className={cn('fixed top-0 z-50 w-full transition-all duration-300', isScrolled ? 'bg-zinc-900 shadow-md backdrop-blur' : 'bg-transparent')}
      >
        {children}
      </header>
    </>
  )
}
