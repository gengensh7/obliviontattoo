'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

// React Bits Fold Text (TS + Tailwind), using the one-shot, top-hinged word mode.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/FoldText/FoldText.tsx
export default function FoldText({ text, className }: { text: string; className?: string }) {
  const root = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const pieces = root.current?.querySelectorAll('.fold-text-piece')
    if (!pieces?.length) return

    const motion = gsap.matchMedia()
    let played = false

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      if (played) return
      played = true

      gsap.fromTo(
        pieces,
        { opacity: 0, rotateX: -92, '--fold-crease': 0.55, force3D: true },
        {
          opacity: 1,
          rotateX: 0,
          '--fold-crease': 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.09,
          clearProps: 'transform,opacity,--fold-crease'
        }
      )
    })

    return () => motion.revert()
  }, [text])

  return (
    <span ref={root} className={className}>
      {text.split(/(\s+)/).map((part, index) =>
        /^\s+$/.test(part) ? part : (
          <span key={index} className="fold-text-segment inline-block transform-3d align-baseline">
            <span className="fold-text-piece relative inline-block origin-top transform-3d backface-hidden">
              {part}
            </span>
          </span>
        )
      )}
    </span>
  )
}
