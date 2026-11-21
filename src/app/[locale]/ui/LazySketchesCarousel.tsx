'use client'

import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import type { SketchesCarouselProps } from './SketchesCarousel'

const SketchesPlaceholder = () => (
  <div aria-hidden="true" className="grid gap-4">
    <div className="mx-auto aspect-3/4 w-3/4 rounded-sm bg-zinc-800 sm:w-3/5 md:w-1/2 lg:w-2/5" />
    <div className="border-t border-white/15 pt-4">
      <div className="h-11" />
    </div>
  </div>
)

const SketchesCarousel = dynamic(() => import('./SketchesCarousel').then((module) => module.SketchesCarousel), {
  ssr: false,
  loading: SketchesPlaceholder
})

export const LazySketchesCarousel = (props: SketchesCarouselProps) => {
  const { ref, inView } = useInView({ rootMargin: '300px 0px', triggerOnce: true, fallbackInView: true })

  return (
    <div ref={ref} className="min-w-0">
      {inView ? <SketchesCarousel {...props} /> : <SketchesPlaceholder />}
    </div>
  )
}
