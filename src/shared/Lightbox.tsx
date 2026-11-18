'use client'

import type PhotoSwipe from 'photoswipe'
import { useEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
  gallery?: string
}

const Lightbox = ({ gallery, children }: Props) => {
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

      const instance = new PhotoSwipe({
        dataSource: { gallery: container },
        children: 'a',
        index: Array.from(container.querySelectorAll('a')).indexOf(link)
      })
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
