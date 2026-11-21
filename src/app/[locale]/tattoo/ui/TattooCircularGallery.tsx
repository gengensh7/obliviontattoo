'use client'

import { useRef, useState, type ReactNode } from 'react'
import CircularGallery, { type GalleryItem } from '@/components/ui/circular-gallery'
import Lightbox, { type LightboxLabels } from '@/shared/Lightbox'

const galleryId = 'tattoo-portfolio'

type Props = {
  items: GalleryItem[]
  titleId: string
  labels: LightboxLabels
  children: ReactNode
}

export function TattooCircularGallery({ items, titleId, labels, children }: Props) {
  const [ready, setReady] = useState(false)
  const originals = useRef<HTMLDivElement>(null)

  return (
    <Lightbox gallery={galleryId} labels={labels} fitOriginal>
      <div id={galleryId} className="relative h-96 sm:h-112 lg:h-134 xl:h-148">
        <div className={ready ? 'absolute inset-0' : 'invisible absolute inset-0'}>
          <CircularGallery
            items={items}
            aria-labelledby={titleId}
            aria-roledescription={undefined}
            bend={1.4}
            borderRadius={0.035}
            itemAspect={0.74}
            itemSize={1.3}
            gap={0.18}
            scrollSpeed={2.2}
            scrollEase={0.11}
            wave={0.25}
            shadow={0}
            fadeEdges={0.08}
            dpr={1.5}
            showTitles={false}
            openOnClick={false}
            controls={{ previous: labels.previous, next: labels.next }}
            onReadyChange={setReady}
            onItemClick={(_, index) => originals.current?.querySelectorAll('a')[index]?.click()}
          />
        </div>

        <div
          ref={originals}
          className={ready ? 'hidden' : 'flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 sm:gap-6'}
        >
          {children}
        </div>
      </div>
    </Lightbox>
  )
}
