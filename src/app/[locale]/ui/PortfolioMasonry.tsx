'use client'

import { Expand } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Lightbox, { type LightboxLabels } from '@/shared/Lightbox'
import { layoutMasonry, MASONRY_WIDTH } from './portfolioMasonryLayout'

type Dimensions = { width: number; height: number }

export type PortfolioPhoto = {
  id: number
  src: string
  alt: string
  dimensions?: Dimensions
  blurDataURL?: string
}

type Props = {
  photos: PortfolioPhoto[]
  openLabel: string
  lightboxLabels: LightboxLabels
}

const fallbackDimensions = { width: 1200, height: 1600 }
const sizes = '(min-width: 1536px) 490px, (min-width: 1280px) 406px, (min-width: 1024px) 323px, (min-width: 768px) 362px, (min-width: 640px) 300px, calc(100vw - 32px)'
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'
const percent = (length: number, total: number) => `${100 * length / total}%`

export default function PortfolioMasonry({ photos, openLabel, lightboxLabels }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState<Record<string, Dimensions>>({})
  // Place the tallest photos first so shorter photos can fill the remaining column heights.
  const ordered = photos.map((photo) => {
    const { width, height } = photo.dimensions ?? measured[photo.src] ?? fallbackDimensions
    return { photo, width, height, aspect: height / width }
  }).sort((first, second) => second.aspect - first.aspect)
  const aspects = ordered.map(({ aspect }) => aspect)
  const [mobile, tablet, desktop] = [24, 17, 12].map((gap, index) =>
    layoutMasonry(aspects, index + 1, gap)
  )

  useEffect(() => {
    const grid = root.current
    if (!grid) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const tiles = Array.from(grid.children) as HTMLElement[]
    const revealed = new Set<Element>()
    const reveals = new IntersectionObserver((entries) => {
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) =>
          first.boundingClientRect.top - second.boundingClientRect.top ||
          first.boundingClientRect.left - second.boundingClientRect.left
        )

      entering.forEach(({ target }, index) => {
        reveals.unobserve(target)
        revealed.add(target)
        const card = target.firstElementChild
        if (motion.matches || !card || card.matches(':focus-within')) return

        card.animate(
          [{ opacity: 0.25, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 360, delay: [0, 48, 82][Math.min(index, 2)], easing, fill: 'backwards' }
        )
      })
    }, { threshold: 0.06 })

    tiles.forEach((tile) => reveals.observe(tile))

    const positions = () => tiles.map((tile) => ({ x: tile.offsetLeft, y: tile.offsetTop, width: tile.offsetWidth }))
    let previous = positions()
    let previousWidth = grid.clientWidth
    let columns = getComputedStyle(grid).getPropertyValue('--portfolio-columns')

    const reflow = new ResizeObserver(() => {
      const width = grid.clientWidth
      const nextColumns = getComputedStyle(grid).getPropertyValue('--portfolio-columns')
      const next = positions()

      if (!motion.matches && (columns !== nextColumns || previousWidth === width)) {
        tiles.forEach((tile, index) => {
          if (!revealed.has(tile)) return

          const from = previous[index]
          const to = next[index]
          if (from.x === to.x && from.y === to.y && from.width === to.width) return

          tile.getAnimations().forEach((animation) => animation.cancel())
          tile.animate(
            [{ transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width})` },
              { transform: 'none' }],
            { duration: 280, easing }
          )
        })
      }

      previous = next
      previousWidth = width
      columns = nextColumns
    })
    reflow.observe(grid)
    tiles.forEach((tile) => reflow.observe(tile))

    const cancelMotion = () => {
      if (motion.matches) grid.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
    }
    motion.addEventListener('change', cancelMotion)

    return () => {
      reveals.disconnect()
      reflow.disconnect()
      motion.removeEventListener('change', cancelMotion)
      grid.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
    }
  }, [photos])

  return (
    <Lightbox gallery="home-portfolio" labels={lightboxLabels} mainClass="portfolio-lightbox">
      <div
        ref={root}
        id="home-portfolio"
        className="portfolio-masonry relative w-full"
        style={{
          '--portfolio-layout-width': MASONRY_WIDTH,
          '--portfolio-mobile-height': mobile.height,
          '--portfolio-tablet-height': tablet.height,
          '--portfolio-desktop-height': desktop.height,
          '--portfolio-mobile-width': percent(mobile.size, MASONRY_WIDTH),
          '--portfolio-tablet-width': percent(tablet.size, MASONRY_WIDTH),
          '--portfolio-desktop-width': percent(desktop.size, MASONRY_WIDTH)
        } as CSSProperties}
      >
        {ordered.map(({ photo, width, height }, index) => {
          const tile = (layout: typeof mobile) => {
            const { left, top } = layout.tiles[index]
            return { left: percent(left, MASONRY_WIDTH), top: percent(top, layout.height) }
          }
          const small = tile(mobile)
          const medium = tile(tablet)
          const large = tile(desktop)

          return (
            <div
              key={photo.id}
              className="portfolio-masonry-tile absolute origin-top-left"
              style={{
                aspectRatio: `${width} / ${height}`,
                '--portfolio-mobile-left': small.left,
                '--portfolio-mobile-top': small.top,
                '--portfolio-tablet-left': medium.left,
                '--portfolio-tablet-top': medium.top,
                '--portfolio-desktop-left': large.left,
                '--portfolio-desktop-top': large.top
              } as CSSProperties}
            >
              <a
                className="relative block h-full w-full cursor-zoom-in overflow-hidden rounded-md bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                href={photo.src}
                data-gtm="portfolio-image-open"
                data-pswp-width={width}
                data-pswp-height={height}
                aria-label={`${openLabel} — ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={width}
                  height={height}
                  sizes={sizes}
                  loading="lazy"
                  placeholder={photo.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={photo.blurDataURL}
                  className="h-full w-full object-contain"
                  onLoad={photo.dimensions ? undefined : ({ currentTarget: image }) => {
                    if (!image.naturalWidth || !image.naturalHeight) return
                    // Optimized previews may report their display density instead of the full image size.
                    const height = Math.round(fallbackDimensions.width * image.naturalHeight / image.naturalWidth)
                    setMeasured((current) => ({ ...current, [photo.src]: { width: fallbackDimensions.width, height } }))
                  }}
                />
                <span className="pointer-events-none absolute right-2 bottom-2 grid size-8 place-items-center rounded-full bg-zinc-950/75 text-white" aria-hidden="true">
                  <Expand className="size-4" />
                </span>
              </a>
            </div>
          )
        })}
      </div>
    </Lightbox>
  )
}
