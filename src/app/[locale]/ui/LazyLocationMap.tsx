'use client'

import { MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const Map = dynamic(() => import('./MapLibre'), {
  loading: () => <Skeleton className="h-full w-full rounded-none bg-zinc-800 motion-reduce:animate-none" aria-hidden="true" />,
  ssr: false
})

interface Props {
  openMapLabel: string
}

export function LazyLocationMap({ openMapLabel }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mapContainer = mapContainerRef.current

    if (!mapContainer || isMapOpen || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setIsMapOpen(true)
        observer.disconnect()
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(mapContainer)

    return () => observer.disconnect()
  }, [isMapOpen])

  return (
    <div ref={mapContainerRef} className="h-88 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 md:h-105 lg:h-120">
      {isMapOpen ? (
        <Map />
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <button
            type="button"
            data-gtm="map-open"
            onClick={() => setIsMapOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 font-medium text-white hover:border-brand-red focus-visible:outline-brand-red focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
            {openMapLabel}
          </button>
        </div>
      )}
    </div>
  )
}
