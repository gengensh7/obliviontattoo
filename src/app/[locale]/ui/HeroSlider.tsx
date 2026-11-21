'use client'

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import FadeContent from '@/shared/FadeContent'
import { HeroSlide } from './HeroSlide'
import { slides, type HeroSliderProps } from './heroSlides'

const HeroSlider = ({ cards, labels }: HeroSliderProps) => {
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const showSlide = (index: number) => {
    const next = (index + slides.length) % slides.length
    if (next === activeSlide) return
    setTransitioning(true)
    setActiveSlide(next)
  }

  useEffect(() => {
    if (!transitioning) return
    const timeout = window.setTimeout(() => setTransitioning(false), 700)
    return () => window.clearTimeout(timeout)
  }, [activeSlide, transitioning])

  useEffect(() => {
    if (paused || hovered || transitioning) return
    const timeout = window.setTimeout(() => {
      setTransitioning(true)
      setActiveSlide((index) => (index + 1) % slides.length)
    }, 3000)
    return () => window.clearTimeout(timeout)
  }, [activeSlide, paused, hovered, transitioning])

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible') && event.target.dataset.gtm !== 'hero-slider-autoplay') setPaused(true)
      }}
    >
      <FadeContent
        effect="focus"
        trigger="mount"
        duration={0.52}
        initialOpacity={0.8}
        className="grid min-h-screen touch-pan-y"
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('a, button')) return
          pointerStart.current = { x: event.clientX, y: event.clientY }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerCancel={() => { pointerStart.current = null }}
        onPointerUp={(event) => {
          const start = pointerStart.current
          pointerStart.current = null
          if (!start) return
          const x = event.clientX - start.x
          const y = event.clientY - start.y
          if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y)) showSlide(activeSlide + (x < 0 ? 1 : -1))
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            inert={index !== activeSlide}
            aria-hidden={index !== activeSlide}
            className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-700 ease-out ${index === activeSlide ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <HeroSlide slide={slide} card={cards[slide.key]} preload={index === 0} active={index === activeSlide} />
          </div>
        ))}
      </FadeContent>

      <div className="absolute inset-x-0 bottom-16 z-30 container sm:bottom-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label={labels.previousSlide}
            data-gtm="hero-slider-previous"
            onClick={() => showSlide(activeSlide - 1)}
            className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                aria-label={`${labels.slide} ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
                data-gtm="hero-slider-slide"
                data-gtm-slide={slide.key}
                onClick={() => showSlide(index)}
                className="flex size-6 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className={`size-3 rounded-full ${index === activeSlide ? 'bg-red-500' : 'bg-white'}`} />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={labels.nextSlide}
            data-gtm="hero-slider-next"
            onClick={() => showSlide(activeSlide + 1)}
            className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="size-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label={paused ? labels.play : labels.pause}
            data-gtm="hero-slider-autoplay"
            onClick={() => setPaused((value) => !value)}
            className="flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
          >
            {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
