'use client'

import type PhotoSwipe from 'photoswipe'
import type { PhotoSwipeEventsMap } from 'photoswipe'
import { useEffect, useRef } from 'react'

export type LightboxLabels = {
  close: string
  previous: string
  next: string
  zoom: string
  error: string
}

type Props = {
  children: React.ReactNode
  gallery?: string
  labels?: LightboxLabels
  mainClass?: string
  fitOriginal?: boolean
}

const Lightbox = ({ gallery, labels, mainClass, fitOriginal, children }: Props) => {
  const viewer = useRef<PhotoSwipe | null>(null)

  useEffect(() => () => viewer.current?.destroy(), [])

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return
    const link = event.target.closest<HTMLAnchorElement>('a')
    if (!link) return

    const container = gallery ? link.closest<HTMLElement>(`#${gallery}`) : event.currentTarget
    if (!container) return
    event.preventDefault()

    try {
      const [{ default: PhotoSwipe }] = await Promise.all([import('photoswipe'), import('photoswipe/style.css')])
      if (!container.contains(link) || !link.isConnected || viewer.current) return

      const items = Array.from(container.querySelectorAll('a'))
      if (link.dataset.pswpOrder !== undefined) {
        items.sort((first, second) => Number(first.dataset.pswpOrder) - Number(second.dataset.pswpOrder))
      }

      const instance = new PhotoSwipe({
        dataSource: { gallery: container, items },
        children: 'a',
        index: items.indexOf(link),
        mainClass,
        ...(fitOriginal && { showHideAnimationType: 'fade' }),
        ...(labels && {
          closeTitle: labels.close,
          arrowPrevTitle: labels.previous,
          arrowNextTitle: labels.next,
          zoomTitle: labels.zoom,
          errorMsg: labels.error
        })
      })
      if (fitOriginal) {
        // Remote originals can have different proportions from their thumbnails.
        const resizeToOriginal = ({ content }: PhotoSwipeEventsMap['contentAppend']) => {
          const { element, slide } = content
          if (!(element instanceof HTMLImageElement) || !element.naturalWidth || !slide) return

          const { naturalWidth, naturalHeight } = element
          if (slide.width === naturalWidth && slide.height === naturalHeight) return

          content.width = slide.width = naturalWidth
          content.height = slide.height = naturalHeight
          slide.resize()
        }

        instance.on('loadComplete', resizeToOriginal)
        instance.on('contentAppend', resizeToOriginal)
      }
      viewer.current = instance
      instance.on('destroy', () => {
        viewer.current = null
      })
      instance.init()
    } catch {
      if (link.isConnected) window.location.assign(link.href)
    }
  }

  return <div className="contents" onClick={handleClick}>{children}</div>
}

export default Lightbox
