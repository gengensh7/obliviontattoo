'use client'

/*
React Bits Glass Surface, rounded SVG renderer (TypeScript + Tailwind)
https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Components/GlassSurface/GlassSurface.tsx

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

import { useEffect, useId, useRef } from 'react'
import { cn } from '@/lib/utils'

function generateDisplacementMap(width: number, height: number, borderRadius: number) {
  const edgeSize = Math.min(width, height) * 0.035

  const svgContent = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
          <filter id="soft" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="black"></rect>
        <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#red)" />
        <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#blue)" style="mix-blend-mode: difference" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${width - edgeSize * 2}" height="${height - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% 50% / 0.93)" filter="url(#soft)" />
      </svg>
  `

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
}

// Chrome supports SVG references in backdrop-filter. Other browsers use the frosted surface.
function supportsRefraction(filter: string) {
  const userAgent = navigator.userAgent
  const isWebKit = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
  return !isWebKit && !/Firefox/.test(userAgent) && CSS.supports('backdrop-filter', filter)
}

export default function GlassSurface({ visible, className }: { visible: boolean; className?: string }) {
  const filterId = `header-glass-${useId().replace(/:/g, '-')}`
  const surfaceRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<SVGFEImageElement>(null)

  useEffect(() => {
    const surface = surfaceRef.current
    const map = mapRef.current
    const filter = `url(#${filterId}) saturate(1.35)`
    if (!surface || !map || !supportsRefraction(filter)) return

    const updateMap = () => {
      const { width, height } = surface.getBoundingClientRect()
      if (!width || !height) return
      const radius = Math.min(parseFloat(getComputedStyle(surface).borderTopLeftRadius), width / 2, height / 2)
      map.setAttribute('href', generateDisplacementMap(width, height, radius))
      surface.style.backdropFilter = filter
    }

    updateMap()
    const observer = new ResizeObserver(updateMap)
    observer.observe(surface)
    return () => observer.disconnect()
  }, [filterId])

  return (
    <div
      ref={surfaceRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-1 rounded-3xl bg-zinc-950/65 bg-linear-135 from-white/10 via-transparent to-white/5 shadow-lg shadow-black/25 inset-ring inset-ring-white/15 backdrop-blur-md backdrop-saturate-150 motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <svg className="absolute size-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={mapRef} width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-60" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-58" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-56" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation="4" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
