'use client'

import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

const waveColors = ['#57303d', '#372c37', '#49404a', '#4f2b38', '#302831']
const frameInterval = 1000 / 30

// Adapted from https://ui.aceternity.com/components/wavy-background
export function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const noise = createNoise3D()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let center = 0
    let phase = 0
    let frame = 0
    let previousTime = 0
    let inView = false

    const drawWaves = () => {
      context.clearRect(0, 0, width, height)
      context.lineWidth = Math.min(54, width * 0.1)

      const bandwidth = Math.min(800, width * 0.85)
      const amplitude = Math.min(100, width * 0.2)

      waveColors.forEach((color, index) => {
        context.beginPath()
        context.strokeStyle = color
        for (let x = -6; x <= width + 6; x += 6) {
          const y = center + noise(x / bandwidth, 0.3 * index, phase) * amplitude
          context.lineTo(x, y)
        }
        context.stroke()
      })
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      if (!width || !height) return
      center = Math.min(height * 0.63, window.innerHeight * 0.66)

      // A small backing buffer is enough for the blurred ribbons.
      const scale = Math.min(0.75, 960 / width, 640 / height)
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
      drawWaves()
    }

    const animate = (time: number) => {
      previousTime ||= time
      const elapsed = time - previousTime
      if (elapsed >= frameInterval) {
        const step = elapsed - (elapsed % frameInterval)
        previousTime += step
        phase += Math.min(step, frameInterval * 2) * 0.000075
        if (width && height) drawWaves()
      }
      frame = requestAnimationFrame(animate)
    }

    const syncAnimation = () => {
      const shouldAnimate = inView && !document.hidden && !reducedMotion.matches
      if (shouldAnimate && !frame) {
        frame = requestAnimationFrame(animate)
      } else if (!shouldAnimate && frame) {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = 0
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncAnimation()
    })

    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    reducedMotion.addEventListener('change', syncAnimation)
    document.addEventListener('visibilitychange', syncAnimation)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      reducedMotion.removeEventListener('change', syncAnimation)
      document.removeEventListener('visibilitychange', syncAnimation)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full opacity-85 blur-xs md:blur-sm"
    />
  )
}
