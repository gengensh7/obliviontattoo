'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'

// Adapted from https://ui.aceternity.com/components/apple-cards-carousel.
const controlClass = 'inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-zinc-900 text-white hover:border-brand-red focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-40'

type CarouselProps = {
  items: ReactNode[]
  previous: string
  next: string
  action: ReactNode
}

type Drag = { id: number; x: number; left: number; moved: boolean }

export function Carousel({ items, previous, next, action }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const trackId = useId()
  const drag = useRef<Drag | null>(null)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })

  function checkScrollability(track: HTMLDivElement) {
    const left = track.scrollLeft > 1
    const right = track.scrollLeft + track.clientWidth < track.scrollWidth - 1
    setCanScroll((current) => current.left === left && current.right === right ? current : { left, right })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const observer = new ResizeObserver(() => checkScrollability(track))
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current
    const first = track?.children[0]
    const second = track?.children[1]
    if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) return

    track?.scrollBy({
      left: direction * (second.offsetLeft - first.offsetLeft),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    })
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    drag.current = {
      id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || gesture.id !== event.pointerId) return

    const track = event.currentTarget
    const delta = event.clientX - gesture.x
    if (!gesture.moved && Math.abs(delta) <= 5) return
    if (!gesture.moved) {
      gesture.moved = true
      track.dataset.dragging = 'true'
      track.setPointerCapture(event.pointerId)
    }
    track.scrollLeft = gesture.left - delta
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || gesture.id !== event.pointerId) return

    drag.current = null
    delete event.currentTarget.dataset.dragging
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div
        id={trackId}
        ref={trackRef}
        className="relative flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 select-none data-dragging:cursor-grabbing data-dragging:snap-none sm:gap-5"
        onScroll={(event) => checkScrollability(event.currentTarget)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onPointerLeave={(event) => { if (!drag.current?.moved) finishDrag(event) }}
      >
        {items}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {action}
        <div className="flex gap-2">
          <button type="button" className={controlClass} aria-label={previous} aria-controls={trackId} disabled={!canScroll.left} onClick={() => scrollByCard(-1)}>
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <button type="button" className={controlClass} aria-label={next} aria-controls={trackId} disabled={!canScroll.right} onClick={() => scrollByCard(1)}>
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
