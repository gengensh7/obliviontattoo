'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'

const SparklesCore = dynamic(() => import('@/components/ui/sparkles').then((module) => module.SparklesCore), { ssr: false })
const motionQuery = '(prefers-reduced-motion: no-preference) and (forced-colors: none)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(motionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function canAnimate() {
  return window.matchMedia(motionQuery).matches
}

export function CourseSparkles() {
  const enabled = useSyncExternalStore(subscribe, canAnimate, () => false)

  return enabled && (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full max-h-144 mask-b-from-35% mask-b-to-100% opacity-65 md:max-h-200 xl:max-h-240">
      <SparklesCore
        className="h-full w-full"
        background="transparent"
        particleColor="#ffd5df"
        particleDensity={18}
        minSize={0.45}
        maxSize={1.25}
        speed={0.65}
      />
    </div>
  )
}
