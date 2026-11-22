'use client'

import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import type { SketchesCarouselProps } from './SketchesCarousel'

import { SketchesPlaceholder } from './SketchesPlaceholder'

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
