'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppLocale } from '@/i18n/routing'
import type { GalleryBatch } from '@/lib/galleryImages'
import Lightbox, { type LightboxLabels } from '@/shared/Lightbox'
import { ParallaxScroll } from './ParallaxScroll'

type Props = {
  initial: GalleryBatch
  locale: AppLocale
  labels: { loading: string; more: string; empty: string }
  lightboxLabels: LightboxLabels
}

export function GalleryFeed({ initial, locale, labels, lightboxLabels }: Props) {
  const [batches, setBatches] = useState([initial])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const sentinel = useRef<HTMLDivElement>(null)
  const request = useRef<AbortController | null>(null)
  const cursor = batches[batches.length - 1].nextCursor

  const load = useCallback(async () => {
    if (!cursor || request.current) return
    const controller = new AbortController()
    request.current = controller
    setStatus('loading')

    try {
      const query = new URLSearchParams({ locale, cursor })
      const response = await fetch(`/api/gallery?${query}`, { signal: controller.signal })
      if (!response.ok) throw new Error('Gallery request failed')
      const next: GalleryBatch = await response.json()
      if (controller.signal.aborted) return
      setBatches((current) => {
        if (current[current.length - 1].nextCursor !== cursor) return current
        const seen = new Set(current.flatMap((batch) => batch.items.map((item) => item.id)))
        return [...current, { ...next, items: next.items.filter((item) => !seen.has(item.id)) }]
      })
      setStatus('idle')
    } catch {
      if (!controller.signal.aborted) setStatus('error')
    } finally {
      if (request.current === controller) request.current = null
    }
  }, [cursor, locale])

  useEffect(() => () => request.current?.abort(), [])

  // Appending photos moves the FAQ and contacts below their previous reveal positions.
  useEffect(() => {
    if (batches.length > 1) ScrollTrigger.refresh()
  }, [batches.length])

  useEffect(() => {
    if (status !== 'idle' || !cursor || !sentinel.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void load()
    }, { rootMargin: '0px 0px 200px' })
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [load, cursor, status])

  if (!initial.items.length) return <p className="text-zinc-300">{labels.empty}</p>

  return (
    <>
      <Lightbox labels={lightboxLabels} fitOriginal>
        <div className="grid gap-4 sm:gap-8">
          {batches.map(({ items }) => items.length > 0 && (
            <ParallaxScroll key={items[0].id} items={items} firstPhotoId={initial.items[0].id} />
          ))}
        </div>
      </Lightbox>
      {cursor && (
        <div ref={sentinel} className="flex min-h-14 justify-center pt-8">
          <div role="status" className="flex items-center gap-2 text-sm text-zinc-300">
            {status === 'loading' && <><span aria-hidden="true" className="h-1.5 w-8 rounded-full bg-zinc-500 motion-safe:animate-pulse" />{labels.loading}</>}
          </div>
          {status === 'error' && <button type="button" onClick={load} className="min-h-12 rounded-md border border-zinc-600 px-5 font-semibold text-white hover:border-brand-red">{labels.more}</button>}
        </div>
      )}
    </>
  )
}
