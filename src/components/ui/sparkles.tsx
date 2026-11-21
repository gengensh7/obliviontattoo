'use client'

import type { Container, ISourceOptions } from '@tsparticles/engine'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion, useAnimation } from 'motion/react'
import { useCallback, useId, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Aceternity UI Sparkles, adapted to the tsParticles 4 provider.
// https://ui.aceternity.com/components/sparkles
type ParticlesProps = {
  id?: string
  className?: string
  background?: string
  particleSize?: number
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export function SparklesCore({
  id,
  className,
  background = '#0d47a1',
  particleSize,
  minSize = particleSize ?? 1,
  maxSize = particleSize ?? 3,
  speed = 4,
  particleColor = '#ffffff',
  particleDensity = 120
}: ParticlesProps) {
  const generatedId = useId()
  const controls = useAnimation()
  const particlesLoaded = useCallback((container?: Container) => {
    if (container) void controls.start({ opacity: 1, transition: { duration: 1 } })
  }, [controls])

  const options = useMemo<ISourceOptions>(() => ({
    background: { color: { value: background } },
    fullScreen: { enable: false },
    fpsLimit: 60,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    particles: {
      color: { value: particleColor },
      move: { enable: true, speed: { min: 0.1, max: 1 }, outModes: { default: 'out' } },
      number: { density: { enable: true, width: 400, height: 400 }, value: particleDensity },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: { enable: true, speed, startValue: 'random', sync: false }
      },
      shape: { type: 'circle' },
      size: { value: { min: minSize, max: maxSize } }
    },
    detectRetina: true
  }), [background, minSize, maxSize, speed, particleColor, particleDensity])

  return (
    <motion.div animate={controls} className={cn('opacity-0', className)}>
      <ParticlesProvider init={loadSlim}>
        <Particles id={id ?? generatedId} className="h-full w-full" particlesLoaded={particlesLoaded} options={options} />
      </ParticlesProvider>
    </motion.div>
  )
}
