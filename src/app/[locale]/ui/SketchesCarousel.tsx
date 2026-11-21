'use client'

import { ChevronLeft, ChevronRight, Expand, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import { SUPABASE_S3_URL } from '@/lib/config'
import FoldText from '@/shared/FoldText'
import Lightbox from '@/shared/Lightbox'

type SketchImage = {
  url: string
  alt: string
  title: string
  position: string
}

export type SketchesCarouselProps = {
  images: SketchImage[]
  labels: { previous: string; next: string; openImage: string; pause: string; play: string }
}

type MouseDrag = { pointerId: number; x: number; left: number; moved: boolean }

const motionQuery = '(prefers-reduced-motion: reduce)'
const subscribeToMotion = (onChange: () => void) => {
  const media = window.matchMedia(motionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches
const formatNumber = (value: number) => String(value).padStart(2, '0')
const arrowClassName =
  'grid size-11 shrink-0 place-items-center rounded-full border border-white/20 text-white pointer-fine:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/*
 * Adapted from FocusPullCarousel by Kedhareswer Naidu.
 * https://dev.21st.dev/@kedhareswer/components/focus-pull-carousel
 *
 * MIT License
 * Copyright (c) 2026 Kedhareswer Naidu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
function focusOf(distance: number) {
  const amount = Math.min(Math.abs(distance), 1)

  return {
    scale: 1 - 0.14 * amount,
    opacity: 1 - 0.5 * amount,
    saturate: 1 - 0.45 * amount,
    contrast: 1 - 0.18 * amount
  }
}

export const SketchesCarousel = ({ images, labels }: SketchesCarouselProps) => {
  const count = images.length
  const canNavigate = count > 1
  const firstOriginal = canNavigate ? count : 0
  const slides = canNavigate ? [...images, ...images, ...images] : images
  const trackRef = useRef<HTMLDivElement>(null)
  const nearestIndex = useRef(firstOriginal)
  const requestedIndex = useRef<number>(null)
  const drag = useRef<MouseDrag>(null)
  const suppressClick = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [wantsPlayback, setWantsPlayback] = useState(true)
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, () => false)
  const isPlaying = canNavigate && !reducedMotion && wantsPlayback

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const media = window.matchMedia(motionQuery)
    const slides = track.children as HTMLCollectionOf<HTMLDivElement>
    let frame = 0
    let settleTimer = 0
    let touching = false

    const update = () => {
      frame = 0

      const width = slides[0]?.offsetWidth || 1
      const center = track.scrollLeft + track.clientWidth / 2
      // Read every snap position before writing any of the photo styles.
      const distances = Array.from(slides, (slide) => slide.offsetLeft + slide.offsetWidth / 2 - center)
      let closest = 0

      distances.forEach((distance, index) => {
        if (Math.abs(distance) < Math.abs(distances[closest])) closest = index

        const photo = slides[index].firstElementChild as HTMLElement
        if (media.matches) {
          photo.style.transform = ''
          photo.style.filter = ''
          photo.style.opacity = ''
          return
        }

        // A centered snap can land on a fractional device pixel.
        const focus = focusOf(Math.abs(distance) <= 1 ? 0 : distance / width)
        photo.style.transform = `scale(${focus.scale.toFixed(4)})`
        photo.style.filter = `saturate(${focus.saturate.toFixed(3)}) contrast(${focus.contrast.toFixed(3)})`
        photo.style.opacity = focus.opacity.toFixed(3)
      })

      const target = requestedIndex.current
      if (target !== null && Math.abs(distances[target]) <= 1) requestedIndex.current = null

      if (closest !== nearestIndex.current) {
        nearestIndex.current = closest
        setActiveIndex(closest % count)
      }
    }

    const centerSlide = (index: number) => {
      const slide = slides[index]
      if (!slide) return
      track.scrollTo({
        left: slide.offsetLeft + (slide.offsetWidth - track.clientWidth) / 2,
        behavior: 'instant'
      })
    }

    const settle = () => {
      if (!canNavigate || drag.current?.moved || touching) return
      if (frame) cancelAnimationFrame(frame)
      update()

      const index = nearestIndex.current
      const original = firstOriginal + (index % count)
      if (index === original) return

      // An identical set surrounds each seam, so the settled image and its neighbors match.
      requestedIndex.current = null
      centerSlide(original)
      update()
    }

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const hasScrollEnd = Reflect.has(track, 'onscrollend')
    const scheduleSettle = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, 120)
    }
    const handleScroll = () => {
      scheduleUpdate()
      if (!hasScrollEnd && canNavigate) scheduleSettle()
    }
    const handleTouchStart = () => {
      touching = true
    }
    const handleTouchEnd = () => {
      touching = false
      scheduleSettle()
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(track)
    track.addEventListener('scroll', handleScroll, { passive: true })
    track.addEventListener('scrollend', settle)
    if (!hasScrollEnd) {
      track.addEventListener('touchstart', handleTouchStart, { passive: true })
      track.addEventListener('touchend', handleTouchEnd, { passive: true })
      track.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    }
    media.addEventListener('change', scheduleUpdate)
    centerSlide(firstOriginal)
    update()

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      resizeObserver.disconnect()
      track.removeEventListener('scroll', handleScroll)
      track.removeEventListener('scrollend', settle)
      track.removeEventListener('touchstart', handleTouchStart)
      track.removeEventListener('touchend', handleTouchEnd)
      track.removeEventListener('touchcancel', handleTouchEnd)
      media.removeEventListener('change', scheduleUpdate)
    }
  }, [canNavigate, count, firstOriginal])

  const goTo = (index: number, smooth: boolean) => {
    const track = trackRef.current
    const slide = track?.children[index] as HTMLDivElement | undefined
    if (!track || !slide) return

    requestedIndex.current = index
    track.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
      behavior: smooth && !reducedMotion ? 'smooth' : 'instant'
    })
  }

  const step = (direction: -1 | 1, smooth: boolean) => {
    const current = requestedIndex.current ?? nearestIndex.current
    goTo(Math.max(0, Math.min(current + direction, slides.length - 1)), smooth)
  }

  const advanceAutomatically = useEffectEvent(() => step(1, true))

  useEffect(() => {
    const track = trackRef.current
    if (!isPlaying || !track) return

    let timer = 0
    let inView = false
    let hovered = window.matchMedia('(hover: hover)').matches && track.matches(':hover')

    const schedule = () => {
      window.clearTimeout(timer)
      if (inView && !hovered && !document.hidden) {
        timer = window.setTimeout(() => {
          advanceAutomatically()
          schedule()
        }, 5500)
      }
    }
    const handleEnter = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      hovered = true
      schedule()
    }
    const handleLeave = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      hovered = false
      schedule()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      schedule()
    })

    observer.observe(track)
    document.addEventListener('visibilitychange', schedule)
    track.addEventListener('pointerenter', handleEnter)
    track.addEventListener('pointerleave', handleLeave)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', schedule)
      track.removeEventListener('pointerenter', handleEnter)
      track.removeEventListener('pointerleave', handleLeave)
    }
  }, [isPlaying])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canNavigate || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    setWantsPlayback(false)
    if (event.target instanceof HTMLAnchorElement) event.currentTarget.focus({ preventScroll: true })
    step(event.key === 'ArrowLeft' ? -1 : 1, false)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (canNavigate) setWantsPlayback(false)
    requestedIndex.current = null
    suppressClick.current = false
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
      moved: false
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current
    if (!gesture || gesture.pointerId !== event.pointerId) return

    const track = event.currentTarget
    const delta = event.clientX - gesture.x
    if (!gesture.moved && Math.abs(delta) <= 4) return
    if (!gesture.moved) {
      gesture.moved = true
      track.dataset.dragging = 'true'
      track.setPointerCapture(event.pointerId)
    }
    track.scrollLeft = gesture.left - delta
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    drag.current = null
    if (!gesture.moved) return

    const track = event.currentTarget
    const center = track.scrollLeft + track.clientWidth / 2
    const slides = Array.from(track.children) as HTMLDivElement[]
    const distances = slides.map((slide) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center))

    suppressClick.current = true
    delete track.dataset.dragging
    goTo(distances.indexOf(Math.min(...distances)), true)
  }

  return (
    <div
      role="group"
      aria-labelledby="sketches-title"
      tabIndex={-1}
      className="@container grid min-w-0 gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      onKeyDown={handleKeyDown}
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible:not([data-sketches-playback])')) setWantsPlayback(false)
      }}
    >
      <Lightbox gallery="home-sketches">
        <div
          id="home-sketches"
          ref={trackRef}
          className="sketches-track relative flex snap-x snap-mandatory items-center gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain select-none data-dragging:cursor-grabbing data-dragging:snap-none sm:gap-4 lg:gap-6"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
          onPointerLeave={(event) => {
            if (!drag.current?.moved) finishDrag(event)
          }}
          onWheel={(event) => {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) setWantsPlayback(false)
            requestedIndex.current = null
          }}
          onClickCapture={(event) => {
            if (!suppressClick.current || event.detail === 0) return
            suppressClick.current = false
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          {slides.map((item, slideIndex) => {
            const index = slideIndex % count
            const src = `${SUPABASE_S3_URL}/${item.url}`
            const isActive = index === activeIndex
            const isOriginal = slideIndex === index + firstOriginal
            const photoClassName = `relative block aspect-3/4 w-full overflow-hidden rounded-sm bg-zinc-950 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${isActive ? 'cursor-zoom-in' : 'cursor-pointer motion-reduce:opacity-50'}`

            const photo = (
              <>
                <Image
                  src={src}
                  alt={isOriginal ? item.alt : ''}
                  fill
                  sizes="(min-width: 1536px) 602px, (min-width: 1280px) 500px, (min-width: 1024px) 397px, (min-width: 768px) 368px, (min-width: 640px) 365px, 75vw"
                  loading="eager"
                  draggable={false}
                  className="pointer-events-none object-contain"
                />
                {isActive && (
                  <Expand
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 bottom-3 size-8 rounded-full bg-zinc-950/80 p-2 text-white"
                  />
                )}
              </>
            )

            return (
              <div
                key={`${Math.floor(slideIndex / count)}:${item.url}`}
                className="sketches-slide shrink-0 snap-center snap-always"
                aria-hidden={!isOriginal || !isActive}
              >
                {isOriginal ? (
                  <a
                    href={src}
                    tabIndex={isActive ? 0 : -1}
                    data-pswp-order={index}
                    data-pswp-width={3024}
                    data-pswp-height={4032}
                    className={photoClassName}
                    draggable={false}
                    onClick={(event) => {
                      setWantsPlayback(false)
                      if (isActive || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                      event.preventDefault()
                      event.stopPropagation()
                      goTo(slideIndex, true)
                    }}
                  >
                    <span className="sr-only">{labels.openImage}</span>
                    {photo}
                  </a>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    className={photoClassName}
                    onPointerDown={(event) => {
                      if (event.pointerType === 'mouse') event.preventDefault()
                    }}
                    onClick={() => {
                      if (isActive) {
                        const originalIndex = index + firstOriginal
                        goTo(originalIndex, false)
                        const original = trackRef.current?.children[originalIndex]?.querySelector('a')
                        original?.click()
                      } else {
                        goTo(slideIndex, true)
                      }
                    }}
                  >
                    {photo}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </Lightbox>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-4 sm:gap-x-6">
        <div className="grid min-w-0 grow basis-44">
          {images.map((item, index) => (
            <h3
              key={item.url}
              className={`col-start-1 row-start-1 wrap-break-word text-lg leading-snug font-semibold text-white sm:text-xl ${index === activeIndex ? '' : 'invisible'}`}
            >
              <FoldText text={item.title} subtle active={index === activeIndex} />
            </h3>
          ))}
        </div>
        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <span aria-hidden="true" className="text-sm whitespace-nowrap text-zinc-300 tabular-nums">
            {formatNumber(activeIndex + 1)} / {formatNumber(images.length)}
          </span>
          {canNavigate && (
            <div className="flex gap-1 sm:gap-2">
              {!reducedMotion && (
                <button
                  type="button"
                  className={arrowClassName}
                  aria-label={isPlaying ? labels.pause : labels.play}
                  aria-controls="home-sketches"
                  data-sketches-playback
                  onClick={() => setWantsPlayback((playing) => !playing)}
                >
                  {isPlaying ? (
                    <Pause aria-hidden="true" className="size-4" />
                  ) : (
                    <Play aria-hidden="true" className="size-4" />
                  )}
                </button>
              )}
              <button
                type="button"
                className={arrowClassName}
                aria-label={labels.previous}
                aria-controls="home-sketches"
                onClick={(event) => {
                  setWantsPlayback(false)
                  step(-1, event.detail > 0)
                }}
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                className={arrowClassName}
                aria-label={labels.next}
                aria-controls="home-sketches"
                onClick={(event) => {
                  setWantsPlayback(false)
                  step(1, event.detail > 0)
                }}
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
        {images[activeIndex]?.position}
      </p>
    </div>
  )
}
