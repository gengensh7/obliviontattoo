'use client'

/*
React Bits Magic Bento (TypeScript + Tailwind)
https://reactbits.dev/r/MagicBento-TS-TW.json

MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type MagicBentoItem = {
  id: string
  content: ReactNode
  className?: string
  surfaceClassName?: string
}

type MagicBentoProps = {
  items: MagicBentoItem[]
  className?: string
  enableBorderGlow?: boolean
  enableSpotlight?: boolean
  glowColor: string
  spotlightRadius?: number
  intro?: boolean
}

const FALLOFF = [1, 0.973, 0.837, 0.593, 0.317, 0.104, 0.009]

const glowStops = (alpha: string, weight: string) =>
  `${FALLOFF.map(
    (fall, index) => `rgba(var(--mb-glow-rgb), calc(var(${alpha}) * var(${weight}, 0) * ${fall})) ${index * 15}%`
  ).join(', ')}, rgba(var(--mb-glow-rgb), 0) 100%`

const LIGHT_STYLE: CSSProperties = {
  background: `radial-gradient(var(--mb-spot-size) circle at var(--mb-x, -999px) var(--mb-y, -999px), ${glowStops('--mb-spot-alpha', '--mb-hot')})`
}

const BORDER_STYLE: CSSProperties = {
  background: `radial-gradient(var(--mb-border-size) circle at var(--mb-x, -999px) var(--mb-y, -999px), ${glowStops('--mb-glow-alpha', '--mb-near')})`,
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)'
}

export function MagicBento({
  items,
  className,
  enableBorderGlow = true,
  enableSpotlight = true,
  glowColor,
  spotlightRadius = 300,
  intro = true
}: MagicBentoProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasEntered = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)')
    let stop: (() => void) | undefined

    const syncMotion = () => {
      stop?.()
      if (!motion.matches) return

      // The upstream pointer engine tracks one light across all cards, including their shared edges.
      const cells = Array.from(root.children).filter((cell): cell is HTMLElement => cell instanceof HTMLElement)
      const cards = cells.flatMap(cell => {
        const card = cell.firstElementChild
        return card instanceof HTMLElement
          ? [{ cell, card, rect: cell.getBoundingClientRect(), hot: 0, written: new Map<string, string>() }]
          : []
      })
      const pointer = { x: 0, y: 0, inside: false }
      const light = { x: 0, y: 0, near: 0, ready: false }
      let raf = 0
      let last = 0
      let dirty = true
      let visible = false

      const frame = (now: number) => {
        raf = 0
        const dt = Math.min(0.05, (now - last) / 1000 || 0)
        last = now
        if (dirty) {
          dirty = false
          for (const state of cards) state.rect = state.cell.getBoundingClientRect()
        }

        const near = pointer.inside ? 1 : 0
        if (!light.ready && near) {
          light.x = pointer.x
          light.y = pointer.y
          light.ready = true
        }
        const follow = 1 - Math.exp(-dt / 0.05)
        light.x += (pointer.x - light.x) * follow
        light.y += (pointer.y - light.y) * follow
        const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4))
        light.near += (near - light.near) * fade
        let busy = Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3
        if (Math.abs(near - light.near) < 0.002) light.near = near
        else busy = true

        for (const state of cards) {
          const { card, rect, written } = state
          const lx = light.x - rect.left
          const ly = light.y - rect.top
          const px = pointer.x - rect.left
          const py = pointer.y - rect.top
          const inside = pointer.inside && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height

          const hotTarget = inside && enableSpotlight ? 1 : 0
          state.hot += (hotTarget - state.hot) * (1 - Math.exp(-dt / (hotTarget > state.hot ? 0.14 : 0.32)))
          if (Math.abs(hotTarget - state.hot) < 0.002) state.hot = hotTarget
          else busy = true

          const write = (name: string, value: string) => {
            if (written.get(name) === value) return
            written.set(name, value)
            card.style.setProperty(name, value)
          }

          write('--mb-x', `${lx.toFixed(1)}px`)
          write('--mb-y', `${ly.toFixed(1)}px`)
          write('--mb-near', (enableBorderGlow ? light.near : 0).toFixed(3))
          write('--mb-hot', state.hot.toFixed(3))
        }

        if (busy && visible) raf = requestAnimationFrame(frame)
      }

      const wake = () => {
        if (raf || !visible) return
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return
        pointer.x = event.clientX
        pointer.y = event.clientY
        pointer.inside = true
        wake()
      }

      const onPointerLeave = () => {
        pointer.inside = false
        wake()
      }

      const measure = () => {
        dirty = true
        if (light.ready) wake()
      }

      const enter = () => {
        hasEntered.current = true
        cells.forEach((cell, index) => {
          cell.style.setProperty('--mb-delay', `${index * 45}ms`)
        })
        root.dataset.intro = ''
      }

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          if (intro && !hasEntered.current) enter()
          measure()
        } else {
          pointer.inside = false
          cancelAnimationFrame(raf)
          raf = 0
        }
      })

      const resize = new ResizeObserver(measure)
      observer.observe(root)
      resize.observe(root)
      root.addEventListener('pointermove', onPointerMove, { passive: true })
      root.addEventListener('pointerleave', onPointerLeave)
      window.addEventListener('scroll', measure, { capture: true, passive: true })

      stop = () => {
        cancelAnimationFrame(raf)
        observer.disconnect()
        resize.disconnect()
        root.removeEventListener('pointermove', onPointerMove)
        root.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('scroll', measure, { capture: true })
        delete root.dataset.intro
        for (const { card } of cards) {
          card.style.removeProperty('--mb-near')
          card.style.removeProperty('--mb-hot')
        }
      }
    }

    syncMotion()
    motion.addEventListener('change', syncMotion)
    return () => {
      stop?.()
      motion.removeEventListener('change', syncMotion)
    }
  }, [items, enableBorderGlow, enableSpotlight, intro])

  const radius = Math.max(40, spotlightRadius)
  const style = {
    '--mb-glow-rgb': glowColor,
    '--mb-spot-size': `${radius}px`,
    '--mb-border-size': `${Math.round(radius * 0.75)}px`
  } as CSSProperties

  return (
    <div ref={rootRef} className={`magic-bento grid w-full ${className ?? ''}`} style={style}>
      {items.map(item => (
        <div key={item.id} className={`magic-bento__cell min-w-0 ${item.className ?? ''}`}>
          <div
            className={`magic-bento__card relative isolate flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 ring-inset ${item.surfaceClassName ?? 'bg-zinc-900/70'}`}
          >
            {enableSpotlight && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl" style={LIGHT_STYLE} />
            )}
            <div className="relative flex flex-1 flex-col">{item.content}</div>
            {enableBorderGlow && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl p-px"
                style={BORDER_STYLE}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
