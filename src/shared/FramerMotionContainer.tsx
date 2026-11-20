'use client'

import React, { useEffect, useRef } from 'react'

type Props = {
  className?: string
  children: React.ReactNode
}

export const FramerMotionContainer = ({ className, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return

    element.dataset.scrollReveal = 'pending'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.dataset.scrollReveal = 'visible'
        observer.disconnect()
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      delete element.dataset.scrollReveal
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
