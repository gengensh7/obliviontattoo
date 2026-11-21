'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Adapted from https://ui.aceternity.com/components/background-beams-with-collision
const beams = [
  { position: 'left-1/12', length: 'h-16', duration: 7.4, initialProgress: 0.14 },
  { position: 'left-1/6', length: 'h-14', duration: 6.8, initialProgress: 0.02 },
  { position: 'left-1/4', length: 'h-10', duration: 6.2, initialProgress: 0.26 },
  { position: 'left-1/3', length: 'h-20', duration: 7.2, initialProgress: 0.38 },
  { position: 'left-5/12', length: 'h-24', duration: 7.8, initialProgress: 0.08 },
  { position: 'left-7/12', length: 'h-14', duration: 6.9, initialProgress: 0.32 },
  { position: 'left-2/3', length: 'h-12', duration: 6.4, initialProgress: 0.2 },
  { position: 'left-5/6', length: 'h-16', duration: 7, initialProgress: 0.44 },
  { position: 'left-11/12', length: 'h-20', duration: 6.6, initialProgress: 0.5 }
]

const sparks = [
  { x: -22, y: -11, duration: 0.68 },
  { x: -13, y: -24, duration: 0.82 },
  { x: -5, y: -17, duration: 0.62 },
  { x: 8, y: -28, duration: 0.85 },
  { x: 15, y: -16, duration: 0.72 },
  { x: 25, y: -10, duration: 0.64 }
]

export function BackgroundBeamsWithCollision() {
  const layerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const preference = window.matchMedia('(prefers-reduced-motion: no-preference) and (forced-colors: none)')
    let inView = false

    const update = () => setActive(preference.matches && inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })

    observer.observe(layer)
    preference.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)

    return () => {
      observer.disconnect()
      preference.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {active && beams.map((beam) => <CollisionBeam key={beam.position} {...beam} />)}
    </div>
  )
}

function CollisionBeam({ position, length, duration, initialProgress }: (typeof beams)[number]) {
  const [cycle, setCycle] = useState(0)
  const [collision, setCollision] = useState(false)

  useEffect(() => {
    if (!collision) return

    const reset = window.setTimeout(() => {
      setCollision(false)
      setCycle((previous) => previous + 1)
    }, 900)

    return () => window.clearTimeout(reset)
  }, [collision])

  const remainingDistance = cycle === 0 ? 1 - initialProgress : 1

  return (
    <>
      <motion.div
        key={cycle}
        initial={{ y: `${-100 * remainingDistance}%` }}
        animate={{ y: '0%' }}
        transition={{ duration: duration * remainingDistance, ease: 'linear' }}
        onAnimationComplete={() => setCollision(true)}
        className={cn('absolute inset-0 transition-opacity duration-150', collision && 'opacity-0')}
      >
        <div className={cn('absolute bottom-0 w-px rounded-full bg-linear-to-t from-brand-red/65 via-red-800/40 to-transparent', position, length)} />
      </motion.div>

      <AnimatePresence>
        {collision && (
          <div className={cn('absolute bottom-0 h-px w-px', position)}>
            <motion.div
              initial={{ opacity: 0.7, scaleX: 0.55 }}
              animate={{ opacity: 0, scaleX: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute -left-4 h-px w-8 bg-linear-to-r from-transparent via-brand-red/75 to-transparent"
            />
            {sparks.map(({ x, y, duration }) => (
              <motion.span
                key={x}
                initial={{ opacity: 0.55 }}
                animate={{ x, y, opacity: 0 }}
                transition={{ duration, ease: 'easeOut' }}
                className="absolute size-0.5 rounded-full bg-brand-red"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
