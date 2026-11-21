'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

// React Bits Fold Text (TS + Tailwind), using the one-shot, top-hinged word mode.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/FoldText/FoldText.tsx
export default function FoldText({
  text,
  className,
  subtle = false
}: { text: string; className?: string; subtle?: boolean }) {
  const root = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const pieces = element.querySelectorAll('.fold-text-piece')
    if (!pieces.length) return

    const motion = gsap.matchMedia()
    let played = false

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      if (played) return

      let tween: gsap.core.Tween | undefined
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio < 0.2) return
        observer.disconnect()
        played = true
        tween = gsap.fromTo(
          pieces,
          { opacity: subtle ? 0.9 : 0, rotateX: subtle ? -35 : -92, '--fold-crease': subtle ? 0.15 : 0.55, force3D: true },
          {
            opacity: 1,
            rotateX: 0,
            '--fold-crease': 0,
            duration: subtle ? 0.3 : 0.7,
            ease: 'power3.out',
            stagger: { amount: Math.min(subtle ? 0.12 : 0.24, (pieces.length - 1) * 0.09) },
            clearProps: 'transform,opacity,--fold-crease'
          }
        )
      }, { threshold: 0.2 })

      observer.observe(element)
      return () => {
        observer.disconnect()
        tween?.revert()
      }
    })

    return () => motion.revert()
  }, [text, subtle])

  return (
    <span ref={root} className={className ? `fold-text ${className}` : 'fold-text'}>
      {text.split(/(\s+)/).map((part, index) =>
        /^\s+$/.test(part) ? part : (
          <span key={index} className="fold-text-segment inline-block max-w-full transform-3d align-baseline">
            <span className="fold-text-piece relative inline-block max-w-full origin-top wrap-anywhere transform-3d backface-hidden">
              {part}
            </span>
          </span>
        )
      )}
    </span>
  )
}
