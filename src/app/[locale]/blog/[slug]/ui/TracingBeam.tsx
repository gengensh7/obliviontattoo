'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

// Adapted from Aceternity UI's Tracing Beam (ui.aceternity.com/components/tracing-beam).
const spring = { stiffness: 500, damping: 90 }

export function TracingBeam({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const gradient = useId()
  const [height, setHeight] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 35%', 'end 35%'],
    trackContentSize: true
  })

  useEffect(() => {
    const content = ref.current
    if (!content) return
    const observer = new ResizeObserver(() => setHeight(content.offsetHeight))
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, height]), spring)
  const y2 = useTransform(y1, head => head - 160)
  const path = `M 1 0 V -36 l 18 24 V ${height * 0.8} l -18 24 V ${height}`

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-3 w-5 sm:left-0">
        <span className="absolute -top-1 left-3.5 z-1 grid size-2.5 place-items-center rounded-full border border-zinc-600 bg-zinc-950">
          <span className="size-1 rounded-full bg-brand-red" />
        </span>
        {height > 0 && (
          <svg viewBox={`0 0 20 ${height}`} width="20" height={height} className="block">
            <path d={path} fill="none" className="stroke-zinc-800" />
            <path d={path} fill="none" stroke={`url(#${gradient})`} strokeWidth="1.5" className="motion-reduce:hidden" />
            <defs>
              <motion.linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
                <stop stopColor="var(--color-brand-red)" stopOpacity="0" />
                <stop stopColor="var(--color-brand-red)" />
                <stop offset="0.325" stopColor="var(--color-brand-red)" />
                <stop offset="1" stopColor="var(--color-brand-red)" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
        )}
      </div>
      {children}
    </div>
  )
}
