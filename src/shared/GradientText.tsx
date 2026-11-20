'use client'

import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const speed = 4.5
const period = 240

// React Bits Gradient Text (TS + Tailwind), linear variant with its cosine yoyo.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/GradientText/GradientText.tsx
function linearGradient(colors: string[], time: number) {
  const loop = [...colors, colors[0]]
  const swing = (time / speed) % 2
  const offset = (0.5 - Math.cos(Math.PI * swing) / 2) * (period - 100)
  const stops = loop.map((color, index) => {
    const position = (index / (loop.length - 1)) * period - offset
    return `${color} ${position.toFixed(2)}%`
  })

  return `repeating-linear-gradient(90deg, ${stops.join(', ')})`
}

export default function GradientText({
  children,
  colors,
  className
}: {
  children: ReactNode
  colors: string[]
  className?: string
}) {
  const root = useRef<HTMLSpanElement>(null)
  const initialGradient = linearGradient(colors, 0)

  useEffect(() => {
    const element = root.current
    if (!element) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let frame = 0
    let last = 0
    let time = 0

    const tick = (now: number) => {
      time += Math.min(0.05, (now - last) / 1000)
      last = now
      element.style.setProperty('--gt-gradient', linearGradient(colors, time))
      frame = requestAnimationFrame(tick)
    }

    const update = () => {
      if (visible && !motion.matches) {
        if (frame) return
        last = performance.now()
        frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        if (motion.matches) {
          time = 0
          element.style.setProperty('--gt-gradient', initialGradient)
        }
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(element)
    motion.addEventListener('change', update)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      motion.removeEventListener('change', update)
      element.style.setProperty('--gt-gradient', initialGradient)
    }
  }, [colors, initialGradient])

  return (
    <span
      ref={root}
      className={cn('gradient-text inline-block max-w-full', className)}
      style={{ '--gt-gradient': initialGradient } as CSSProperties}
    >
      {children}
    </span>
  )
}
