'use client'

import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'
import { cn } from '@/lib/utils'

type VortexOptions = {
  particleCount: number
  rangeY: number
  baseHue: number
  rangeHue: number
  baseSpeed: number
  rangeSpeed: number
  baseRadius: number
  rangeRadius: number
}

const particleSize = 9
const fullTurn = 2 * Math.PI
const frameInterval = 1000 / 30

const random = (range: number) => Math.random() * range
const fadeInOut = (life: number, ttl: number) => 1 - Math.abs((2 * life) / ttl - 1)

// Aceternity UI Vortex — https://ui.aceternity.com/components/vortex
// The original simplex-noise flow field, adapted to a decorative, section-sized canvas.
function mountVortex(canvas: HTMLCanvasElement, options: VortexOptions) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { particleCount, rangeY, baseHue, rangeHue, baseSpeed, rangeSpeed, baseRadius, rangeRadius } = options
  const noise3D = createNoise3D()
  const particles = new Float32Array(particleCount * particleSize)
  let centerY = 0
  let tick = 0
  let inView = false
  let previousFrame = 0
  let frameId: number | undefined

  const initParticle = (index: number, scatter = false) => {
    const ttl = 50 + random(150)

    particles.set(
      [
        random(canvas.width),
        centerY + rangeY - random(2 * rangeY),
        0,
        0,
        scatter ? random(ttl) : 0,
        ttl,
        baseSpeed + random(rangeSpeed),
        baseRadius + random(rangeRadius),
        baseHue + random(rangeHue)
      ],
      index
    )
  }

  const resize = () => {
    const scale = Math.min(1, 1280 / canvas.clientWidth)
    const width = Math.max(1, Math.round(canvas.clientWidth * scale))
    const height = Math.max(1, Math.round(canvas.clientHeight * scale))
    if (canvas.width === width && canvas.height === height && centerY > 0) return

    canvas.width = width
    canvas.height = height
    centerY = height / 2
    ctx.lineCap = 'round'

    for (let index = 0; index < particles.length; index += particleSize) {
      initParticle(index, true)
    }
  }

  const draw = () => {
    tick += 2
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let index = 0; index < particles.length; index += particleSize) {
      const x = particles[index]
      const y = particles[index + 1]
      const life = particles[index + 4]
      const ttl = particles[index + 5]
      const speed = particles[index + 6]
      const hue = particles[index + 8]
      const angle = noise3D(x * 0.00125, y * 0.00125, tick * 0.0005) * 3 * fullTurn
      const vx = (particles[index + 2] + Math.cos(angle)) / 2
      const vy = (particles[index + 3] + Math.sin(angle)) / 2
      const nextX = x + vx * speed
      const nextY = y + vy * speed

      ctx.lineWidth = particles[index + 7]
      ctx.strokeStyle = `hsla(${hue}, 85%, 51%, ${fadeInOut(life, ttl) * 0.68})`
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nextX, nextY)
      ctx.stroke()

      if (life + 1 > ttl || nextX < 0 || nextX > canvas.width || nextY < 0 || nextY > canvas.height) {
        initParticle(index)
      } else {
        particles[index] = nextX
        particles[index + 1] = nextY
        particles[index + 2] = vx
        particles[index + 3] = vy
        particles[index + 4] = life + 1
      }
    }

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.filter = 'blur(5px) brightness(130%)'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }

  const animate = (time: number) => {
    const elapsed = time - previousFrame
    if (elapsed >= frameInterval) {
      previousFrame = time - (elapsed % frameInterval)
      draw()
    }

    frameId = requestAnimationFrame(animate)
  }

  const pause = () => {
    if (frameId === undefined) return
    cancelAnimationFrame(frameId)
    frameId = undefined
  }

  const syncAnimation = () => {
    if (!inView || document.hidden) {
      pause()
    } else if (frameId === undefined) {
      resize()
      previousFrame = performance.now() - frameInterval
      frameId = requestAnimationFrame(animate)
    }
  }

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    syncAnimation()
  })
  const size = new ResizeObserver(() => {
    if (frameId !== undefined) resize()
  })

  intersection.observe(canvas)
  size.observe(canvas)
  document.addEventListener('visibilitychange', syncAnimation)

  return () => {
    pause()
    intersection.disconnect()
    size.disconnect()
    document.removeEventListener('visibilitychange', syncAnimation)
    canvas.width = canvas.height = 1
  }
}

export function Vortex({
  className,
  particleCount = 700,
  rangeY = 100,
  baseHue = 220,
  rangeHue = 100,
  baseSpeed = 0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2
}: Partial<VortexOptions> & { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const media = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference) and (forced-colors: none)')
    let unmount: (() => void) | undefined

    const syncPreference = () => {
      unmount?.()
      unmount = media.matches
        ? mountVortex(canvas, { particleCount, rangeY, baseHue, rangeHue, baseSpeed, rangeSpeed, baseRadius, rangeRadius })
        : undefined
    }

    syncPreference()
    media.addEventListener('change', syncPreference)

    return () => {
      unmount?.()
      media.removeEventListener('change', syncPreference)
    }
  }, [particleCount, rangeY, baseHue, rangeHue, baseSpeed, rangeSpeed, baseRadius, rangeRadius])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden size-full md:motion-safe:block md:motion-safe:forced-colors:hidden',
        className
      )}
    />
  )
}
