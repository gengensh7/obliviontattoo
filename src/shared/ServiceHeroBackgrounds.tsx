import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { MorphicBackground } from '@/components/ui/morhic-background'
import { Vortex } from '@/components/ui/vortex'

export function TattooHeroBackground() {
  return (
    <Vortex
      className="tattoo-hero-vortex"
      particleCount={520}
      rangeY={210}
      baseHue={335}
      rangeHue={34}
      baseSpeed={0.6}
      rangeSpeed={1.5}
      baseRadius={0.85}
      rangeRadius={1.45}
    />
  )
}

export function PermanentHeroBackground() {
  return (
    <div aria-hidden="true" className="permanent-hero-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden forced-colors:hidden">
      <MorphicBackground ballColor="#a6608f" />
    </div>
  )
}

export function PiercingHeroBackground() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-zinc-950 via-zinc-950 to-red-950/40" />
      <BackgroundBeamsWithCollision />
    </>
  )
}
