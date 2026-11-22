'use client'

import { motion, type MotionStyle, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import type { GalleryBatch } from '@/lib/galleryImages'

// Aceternity UI Parallax Scroll. Each batch has its own fixed set of photos
// and scroll range, so extending the feed cannot move earlier photographs.
export function ParallaxScroll({ items, firstPhotoId }: Pick<GalleryBatch, 'items'> & { firstPhotoId: number }) {
  const grid = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: grid, offset: ['start end', 'end start'] })
  const shift = useTransform(scrollYProgress, [0, 1], ['0px', '40px'])

  return (
    <motion.div ref={grid} style={{ '--gallery-shift': shift } as MotionStyle} className="gallery-parallax grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
      {items.map((photo) => (
        <a key={photo.id} href={photo.src} data-gtm="gallery-image-open"
          data-pswp-width={1200} data-pswp-height={1600}
          className="relative block aspect-4/5 overflow-hidden rounded-xl bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red">
          <Image src={photo.src} alt={photo.alt} fill
            loading={photo.id === firstPhotoId ? 'eager' : 'lazy'}
            sizes="(min-width: 1536px) 480px, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
            className="object-cover" />
        </a>
      ))}
    </motion.div>
  )
}
