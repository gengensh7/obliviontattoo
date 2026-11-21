'use client'

import { useEffect, useId, useRef } from 'react'

// Adapted from Hossain Jahed's Morphic Background demo on 21st.dev.
// https://dev.21st.dev/@jahed/components/morhic-background
const svgNamespace = 'http://www.w3.org/2000/svg'
const particleSize = 30
const spawnInterval = 180

class Particle {
  private readonly element = document.createElementNS(svgNamespace, 'circle')
  private readonly origin = Math.random()
  private readonly drift = Math.random() / 2.5
  private readonly scale = 0.4 + Math.random() * 2
  private readonly speed = 1 + Math.random()

  constructor(container: SVGGElement, private position: number) {
    this.element.setAttribute('r', String(particleSize / 2))
    container.appendChild(this.element)
  }

  move(frameStep: number, width: number, height: number) {
    this.position -= this.speed * frameStep
    if (this.position < -particleSize) {
      this.element.remove()
      return false
    }

    const x = (this.origin + Math.sin(this.position * Math.PI / (height / 2)) * this.drift) * width
    const y = this.position
    // A circle is rotationally invariant, so only its translation and scale are needed.
    this.element.setAttribute('transform', `translate(${x + particleSize / 2} ${y + particleSize / 2}) scale(${this.scale})`)
    return true
  }
}

export function MorphicBackground({ ballColor = '#4285F4' }: { ballColor?: string }) {
  const filterId = useId()
  const viewportRef = useRef<SVGSVGElement>(null)
  const particlesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const layer = particlesRef.current
    if (!viewport || !layer) return

    const staticBackground = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)')
    const particles: Particle[] = []
    let width = 0
    let height = 0
    let visible = false
    let frame: number | undefined
    let previousTime: number | undefined
    let timeSinceSpawn = 0

    const update = (now: number) => {
      // Normalize the demo's per-frame velocity to 60Hz and limit jumps on slow frames.
      const elapsed = Math.min(now - (previousTime ?? now), 1000 / 30)
      previousTime = now
      timeSinceSpawn += elapsed
      const limit = Math.min(24, Math.max(12, Math.round(width / 55)))

      // Start with particles already in view so the first ones needn't rise from below.
      if (particles.length === 0) {
        const count = Math.floor(limit / 2)
        for (let index = 0; index < count; index++) {
          particles.push(new Particle(layer, height * (index + Math.random()) / count))
        }
      } else if (timeSinceSpawn >= spawnInterval) {
        timeSinceSpawn = 0
        if (particles.length < limit) particles.push(new Particle(layer, height + 100))
      }

      for (let index = particles.length - 1; index >= 0; index--) {
        if (!particles[index].move(elapsed * 0.06, width, height)) particles.splice(index, 1)
      }
      frame = requestAnimationFrame(update)
    }

    function stop() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
      previousTime = undefined
    }

    function syncPlayback() {
      if (staticBackground.matches || document.hidden || !visible || !width || !height) {
        stop()
      } else if (frame === undefined) {
        frame = requestAnimationFrame(update)
      }
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    })
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width
      height = entry.contentRect.height
      syncPlayback()
    })
    intersection.observe(viewport)
    resize.observe(viewport)
    document.addEventListener('visibilitychange', syncPlayback)
    staticBackground.addEventListener('change', syncPlayback)

    return () => {
      stop()
      intersection.disconnect()
      intersection.takeRecords()
      resize.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      staticBackground.removeEventListener('change', syncPlayback)
      layer.replaceChildren()
    }
  }, [])

  return (
    <svg
      ref={viewportRef}
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full overflow-hidden opacity-25 motion-reduce:hidden forced-colors:hidden"
    >
      <defs>
        <filter id={filterId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="12" />
          <feColorMatrix in="blur" result="colormatrix" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9" />
          <feBlend in="SourceGraphic" in2="colormatrix" />
        </filter>
      </defs>
      <g ref={particlesRef} filter={`url(#${filterId})`} fill={ballColor} />
    </svg>
  )
}
