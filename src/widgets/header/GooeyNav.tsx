'use client'

/*
React Bits Gooey Nav (TypeScript + Tailwind)
https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Components/GooeyNav/GooeyNav.tsx

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

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import { CourseDropdown } from './CourseDropdown'
import GlassSurface from './GlassSurface'

export type GooeyNavItem = {
  href: string
  destination: string
  label: string
}

const motionQuery = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

function subscribeToMotionPreferences(onChange: () => void) {
  const query = window.matchMedia(motionQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const canAnimate = () => window.matchMedia(motionQuery).matches
const serverCanAnimate = () => false

const linkClass = 'relative inline-flex items-center whitespace-nowrap rounded-full px-3 py-2'
// Match the red-600 fallback so white labels have sufficient contrast.
const pillRgb = [231 / 255, 0, 11 / 255]
const tints = [pillRgb, [251 / 255, 44 / 255, 54 / 255], [193 / 255, 0, 7 / 255]]
const animationTime = 450
const timeVariance = 180
const spread = 24
const particleCount = 15
const gooeyness = 0.5
const wobble = 0.5

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface PillState {
  mass: number
  scale: number
  velocity: number
  outgoing: number
}

interface Drop {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  size: number
  given: number
  source: number
  index: number
  leave: number
  emerged: number
  absorbed: number
  state: 'waiting' | 'flying' | 'absorbing'
  tint: number[]
  start?: number
  duration?: number
  path?: number[]
}

interface Box {
  cx: number
  cy: number
  hw: number
  hh: number
}

interface Blob {
  x: number
  y: number
  r: number
  tx: number
  ty: number
  tint: number[]
}

interface Pipeline {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation | null>
  buffer: WebGLBuffer
  position: number
}

const MAX_DROPS = 32
const MAX_PILLS = 4
const MARGIN = 72

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uSize;
uniform float uRatio;
uniform vec4 uPills[${MAX_PILLS}];
uniform vec4 uDrops[${MAX_DROPS}];
uniform vec2 uTails[${MAX_DROPS}];
uniform vec3 uTints[${MAX_DROPS}];
uniform int uCount;
uniform float uSmooth;
uniform vec3 uPill;
uniform float uShadow;

out vec4 outColor;

float sdPill(vec2 p, vec4 box) {
  vec2 extent = max(box.zw, vec2(0.0));
  float r = min(extent.x, extent.y);
  vec2 q = abs(p - box.xy) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

vec4 blend(vec4 a, vec4 b, float k) {
  float h = clamp(0.5 + 0.5 * (b.w - a.w) / k, 0.0, 1.0);
  return vec4(mix(b.rgb, a.rgb, h), mix(b.w, a.w, h) - k * h * (1.0 - h));
}

vec4 field(vec2 p) {
  vec4 shape = vec4(uPill, 1e5);
  for (int i = 0; i < ${MAX_PILLS}; i++) {
    vec4 pill = uPills[i];
    if (pill.z <= 0.0) continue;
    shape = blend(shape, vec4(uPill, sdPill(p, pill)), uSmooth);
  }
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    if (i >= uCount) break;
    vec4 drop = uDrops[i];
    if (drop.z <= 0.0) continue;
    float d = sdCapsule(p, drop.xy, drop.xy - uTails[i], drop.z);
    if (d > shape.w + uSmooth) continue;
    shape = blend(shape, vec4(uTints[i], d), uSmooth);
  }
  return shape;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uRatio - gl_FragCoord.y) / uRatio;
  vec4 shape = field(p);
  float d = shape.w;
  float aa = max(fwidth(d), 0.35);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);

  vec2 grad = vec2(dFdx(d), -dFdy(d));
  vec2 n = length(grad) > 0.0001 ? normalize(grad) : vec2(0.0, 1.0);
  float rim = (1.0 - smoothstep(0.0, 1.6, -d)) * max(0.0, -n.y) * 0.3;
  vec3 fill = mix(shape.rgb, vec3(1.0), rim) * (1.0 - 0.06 * max(0.0, n.y) * (1.0 - smoothstep(0.0, 6.0, -d)));

  float lifted = field(p - vec2(0.0, 3.0)).w;
  float shadow = (1.0 - smoothstep(-3.0, 9.0, lifted)) * uShadow * (1.0 - body);

  vec4 color = vec4(0.0, 0.0, 0.0, shadow);
  color = vec4(fill * body, body) + color * (1.0 - body);
  outColor = color;
}
`

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const travelEase = (t: number) => {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2
}

const bezier = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

const pillPath = (x: number, y: number, w: number, h: number) => {
  if (w <= 0.5 || h <= 0.5) return ''
  const r = Math.min(w, h) / 2
  return `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`
}

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type) as WebGLShader
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

const UNIFORMS = [
  'uSize',
  'uRatio',
  'uPills',
  'uDrops',
  'uTails',
  'uTints',
  'uCount',
  'uSmooth',
  'uPill',
  'uShadow'
]

const build = (gl: WebGL2RenderingContext): Pipeline | null => {
  const program = gl.createProgram() as WebGLProgram
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  const uniforms = Object.fromEntries(UNIFORMS.map(name => [name, gl.getUniformLocation(program, name)]))
  const buffer = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  return { program, uniforms, buffer, position: gl.getAttribLocation(program, 'aPosition') }
}

export default function GooeyNav({ items, activeIndex, courseLinks, activeCoursePath }: {
  items: GooeyNavItem[]
  activeIndex: number
  courseLinks: GooeyNavItem[]
  activeCoursePath?: string
}) {
  const animate = useSyncExternalStore(subscribeToMotionPreferences, canAnimate, serverCanAnimate)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const overlayRef = useRef<HTMLUListElement>(null)
  const engineRef = useRef<((index: number) => void) | null>(null)
  const indexRef = useRef(activeIndex)

  useLayoutEffect(() => {
    if (!animate) return
    const stage = stageRef.current
    const canvas = canvasRef.current
    const list = listRef.current
    const overlay = overlayRef.current
    if (!stage || !canvas || !list || !overlay) return
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
    if (!gl) return
    const pipeline = build(gl)
    if (!pipeline) return

    const view = { width: 0, height: 0 }
    let rects: Rect[] = []
    let target = -1
    const pills = new Map<number, PillState>()
    const drops: Drop[] = []
    const pillData = new Float32Array(MAX_PILLS * 4)
    const dropData = new Float32Array(MAX_DROPS * 4)
    const tailData = new Float32Array(MAX_DROPS * 2)
    const tintData = new Float32Array(MAX_DROPS * 3)
    let raf = 0
    let last = 0
    let disposed = false

    const measure = () => {
      const box = stage.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      view.width = box.width
      view.height = box.height
      const outerWidth = box.width + MARGIN * 2
      const outerHeight = box.height + MARGIN * 2
      Object.assign(canvas.style, {
        left: `${-MARGIN}px`,
        top: `${-MARGIN}px`,
        width: `${outerWidth}px`,
        height: `${outerHeight}px`
      })
      const width = Math.max(1, Math.round(outerWidth * ratio))
      const height = Math.max(1, Math.round(outerHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      rects = Array.from(list.children).map(item => {
        const rect = item.getBoundingClientRect()
        return { x: rect.left - box.left, y: rect.top - box.top, w: rect.width, h: rect.height }
      })
    }

    const trace = (boxes: Box[], blobs: Blob[], smooth: number) => {
      const field = (x: number, y: number) => {
        let d = 1e5
        const merge = (value: number) => {
          const h = clamp01(0.5 + (0.5 * (value - d)) / smooth)
          d = value + (d - value) * h - smooth * h * (1 - h)
        }
        for (const box of boxes) {
          const r = Math.min(box.hw, box.hh)
          const qx = Math.abs(x - box.cx) - box.hw + r
          const qy = Math.abs(y - box.cy) - box.hh + r
          merge(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r)
        }
        for (const blob of blobs) {
          const px = x - blob.x
          const py = y - blob.y
          const bx = -blob.tx
          const by = -blob.ty
          const span = bx * bx + by * by
          const h = span > 0.0001 ? clamp01((px * bx + py * by) / span) : 0
          const value = Math.hypot(px - bx * h, py - by * h) - blob.r
          if (value > d + smooth) continue
          merge(value)
        }
        return d
      }
      const step = 2
      const parts: string[] = []
      for (let y = 0; y < view.height; y += 1) {
        const cy = y + 0.5
        let previous = field(0, cy)
        let start: number | null = previous < 0 ? 0 : null
        for (let x = step; x <= view.width + step; x += step) {
          const value = field(Math.min(x, view.width), cy)
          if (previous < 0 !== value < 0) {
            const cross = x - step + (step * previous) / (previous - value)
            if (value < 0) start = cross
            else if (start !== null) {
              parts.push(`M${start.toFixed(1)},${y}H${cross.toFixed(1)}V${y + 1}H${start.toFixed(1)}Z`)
              start = null
            }
          }
          previous = value
        }
        if (start !== null) parts.push(`M${start.toFixed(1)},${y}H${view.width}V${y + 1}H${start.toFixed(1)}Z`)
      }
      return parts.join('')
    }

    const pill = (index: number): PillState => {
      if (!pills.has(index)) pills.set(index, { mass: 0, scale: 0, velocity: 0, outgoing: 0 })
      return pills.get(index) as PillState
    }

    const shape = (index: number, amount: number): Rect | null => {
      const rect = rects[index]
      if (!rect || amount <= 0.002) return null
      const h = rect.h * Math.min(1.08, 0.42 + 0.58 * Math.sqrt(Math.max(0, amount)))
      const w = Math.max(h, rect.w * Math.max(0, amount) ** 0.75)
      return { x: rect.x + rect.w / 2 - w / 2, y: rect.y + rect.h / 2 - h / 2, w, h }
    }

    const plan = (drop: Drop, index: number, now: number, fresh: boolean) => {
      const rect = rects[index]
      if (!rect) return
      const reach = Math.max(0, spread)
      const ex = rect.x + rect.w / 2 + (Math.random() - 0.5) * rect.w * 0.45
      const ey = rect.y + rect.h / 2 + (Math.random() - 0.5) * rect.h * 0.2
      const base = Math.max(0.15, animationTime / 1000)
      const variance = (Math.random() - 0.5) * (Math.max(0, timeVariance) / 1000)
      const duration = Math.max(0.15, base * (0.62 + Math.random() * 0.32) + variance * 0.6)
      const out = Math.random() * Math.PI * 2
      const into = Math.random() * Math.PI * 2
      const burst = reach * (0.7 + Math.random() * 0.6)
      const swing = reach * (0.55 + Math.random() * 0.55)
      const carry = Math.min(duration / 3, 0.12)
      drop.index = index
      drop.start = now
      drop.duration = duration
      drop.path = [
        drop.x,
        drop.y,
        fresh ? drop.x + Math.cos(out) * burst * 1.6 : drop.x + drop.vx * carry,
        fresh ? drop.y + Math.sin(out) * burst * 1.6 : drop.y + drop.vy * carry,
        ex + Math.cos(into) * swing * 1.5,
        ey + Math.sin(into) * swing * 1.5,
        ex,
        ey
      ]
    }

    const emit = (from: number, to: number, now: number) => {
      const source = pills.get(from)
      const rect = rects[from < 0 ? to : from]
      if (!rect || !rects[to] || (from >= 0 && !source)) return
      // With no active pill, the drops gather at the destination from its own bounds.
      const available = source ? source.mass - source.outgoing : 1
      if (available <= 0.002) return
      const room = MAX_DROPS - drops.length
      const count = Math.min(room, Math.max(1, Math.round(Math.max(1, particleCount) * available)))
      if (count <= 0) return
      const window = Math.max(0.15, animationTime / 1000) * 0.16
      for (let i = 0; i < count; i++) {
        const mass = available / count
        if (source) source.outgoing += mass
        drops.push({
          x: rect.x + rect.w / 2 + (Math.random() - 0.5) * rect.w * 0.6,
          y: rect.y + rect.h / 2 + (Math.random() - 0.5) * rect.h * 0.3,
          vx: 0,
          vy: 0,
          mass,
          size: 0.8 + Math.random() * 0.4,
          given: 0,
          source: from,
          index: to,
          leave: now + Math.random() * window * 1000,
          emerged: 0,
          absorbed: 0,
          state: 'waiting',
          tint: tints[Math.floor(Math.random() * tints.length)]
        })
      }
    }

    const render = () => {
      const height = rects[target]?.h ?? rects[0]?.h ?? 36
      const smooth = height * (0.18 + 0.5 * clamp01(gooeyness))
      const boxes: Box[] = []
      const blobs: Blob[] = []
      for (const [index, state] of pills) {
        const box = shape(index, state.scale)
        if (box) boxes.push({ cx: box.x + box.w / 2, cy: box.y + box.h / 2, hw: box.w / 2, hh: box.h / 2 })
      }
      for (const drop of drops) {
        if (drop.state === 'waiting') continue
        const radius = 0.26 * height * drop.size * Math.min(drop.emerged, 1 - drop.absorbed)
        if (radius <= 0.05) continue
        const speed = Math.hypot(drop.vx, drop.vy)
        const length = Math.min(radius * 1.1, speed * 0.018)
        blobs.push({
          x: drop.x,
          y: drop.y,
          r: radius,
          tx: speed > 0.01 ? (drop.vx / speed) * length : 0,
          ty: speed > 0.01 ? (drop.vy / speed) * length : 0,
          tint: drop.tint
        })
      }

      const settledPill = boxes.length === 1 && !blobs.length
      if (settledPill) {
        const box = boxes[0]
        overlay.style.clipPath = `path('${pillPath(box.cx - box.hw, box.cy - box.hh, box.hw * 2, box.hh * 2)}')`
      } else {
        overlay.style.clipPath = `path('${trace(boxes, blobs, smooth) || 'M0,0Z'}')`
      }

      let slot = 0
      for (const box of boxes) {
        if (slot >= MAX_PILLS) break
        pillData[slot * 4] = box.cx + MARGIN
        pillData[slot * 4 + 1] = box.cy + MARGIN
        pillData[slot * 4 + 2] = box.hw
        pillData[slot * 4 + 3] = box.hh
        slot += 1
      }
      pillData.fill(0, slot * 4)
      let count = 0
      for (const blob of blobs) {
        if (count >= MAX_DROPS) break
        dropData[count * 4] = blob.x + MARGIN
        dropData[count * 4 + 1] = blob.y + MARGIN
        dropData[count * 4 + 2] = blob.r
        dropData[count * 4 + 3] = 0
        tailData[count * 2] = blob.tx
        tailData[count * 2 + 1] = blob.ty
        const tint = blob.tint
        tintData[count * 3] = tint[0]
        tintData[count * 3 + 1] = tint[1]
        tintData[count * 3 + 2] = tint[2]
        count += 1
      }

      const { program, uniforms, buffer, position } = pipeline
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(uniforms.uSize, view.width + MARGIN * 2, view.height + MARGIN * 2)
      gl.uniform1f(uniforms.uRatio, canvas.width / Math.max(1, view.width + MARGIN * 2))
      gl.uniform4fv(uniforms.uPills, pillData)
      gl.uniform4fv(uniforms.uDrops, dropData)
      gl.uniform2fv(uniforms.uTails, tailData)
      gl.uniform3fv(uniforms.uTints, tintData)
      gl.uniform1i(uniforms.uCount, count)
      gl.uniform1f(uniforms.uSmooth, smooth)
      gl.uniform3f(uniforms.uPill, pillRgb[0], pillRgb[1], pillRgb[2])
      gl.uniform1f(uniforms.uShadow, 0.4)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const frame = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000 || 0)
      last = now
      const emergeTime = 0.09
      const absorbTime = 0.12

      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i]
        if (drop.state === 'waiting') {
          if (now < drop.leave) continue
          drop.state = 'flying'
          plan(drop, drop.index, now, true)
        }
        if (drop.state === 'flying') {
          drop.emerged = Math.min(1, drop.emerged + dt / emergeTime)
          const source = pills.get(drop.source)
          if (source && drop.given < drop.mass) {
            const step = Math.min(drop.mass * (dt / emergeTime), drop.mass - drop.given)
            source.mass = Math.max(0, source.mass - step)
            source.outgoing = Math.max(0, source.outgoing - step)
            drop.given += step
          }
          const t = clamp01((now - (drop.start ?? now)) / 1000 / (drop.duration ?? 1))
          const eased = travelEase(t)
          const [x0, y0, x1, y1, x2, y2, x3, y3] = drop.path ?? [
            drop.x,
            drop.y,
            drop.x,
            drop.y,
            drop.x,
            drop.y,
            drop.x,
            drop.y
          ]
          const x = bezier(x0, x1, x2, x3, eased)
          const y = bezier(y0, y1, y2, y3, eased)
          if (dt > 0) {
            drop.vx = (x - drop.x) / dt
            drop.vy = (y - drop.y) / dt
          }
          drop.x = x
          drop.y = y
          if (t >= 1) drop.state = 'absorbing'
        }
        if (drop.state === 'absorbing') {
          const step = Math.min(1 - drop.absorbed, dt / absorbTime)
          drop.absorbed += step
          drop.vx *= 0.8
          drop.vy *= 0.8
          const host = pill(drop.index)
          host.mass = Math.min(1, host.mass + drop.mass * step)
          if (drop.absorbed >= 1) drops.splice(i, 1)
        }
      }

      const zeta = 1 - 0.72 * clamp01(wobble)
      const omega = 26
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)))
      const h = dt / steps
      for (const [index, state] of pills) {
        for (let n = 0; n < steps; n++) {
          state.velocity += (omega * omega * (state.mass - state.scale) - 2 * zeta * omega * state.velocity) * h
          state.scale += state.velocity * h
        }
        if (index !== target && state.mass <= 0.002 && state.outgoing <= 0.002 && Math.abs(state.scale) < 0.004) {
          pills.delete(index)
        }
      }

      render()

      const host = pills.get(target)
      const resting =
        drops.length === 0 &&
        pills.size === 1 &&
        host &&
        Math.abs(host.mass - host.scale) < 0.0008 &&
        Math.abs(host.velocity) < 0.004
      if (!resting) raf = requestAnimationFrame(frame)
      else {
        host.mass = 1
        host.scale = 1
        host.velocity = 0
        render()
      }
    }

    const wake = () => {
      if (raf || disposed) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const settle = (index: number) => {
      cancelAnimationFrame(raf)
      raf = 0
      pills.clear()
      drops.length = 0
      target = index
      if (index >= 0) {
        const state = pill(index)
        state.mass = 1
        state.scale = 1
      }
      render()
    }

    const go = (index: number) => {
      if (index === target) return
      if (!rects[index]) {
        settle(index)
        return
      }
      const now = performance.now()
      const entering = target < 0
      target = index
      pill(index)
      for (const drop of drops) {
        drop.index = index
        if (drop.state === 'flying') plan(drop, index, now, false)
        if (drop.state === 'absorbing') {
          drop.state = 'flying'
          drop.mass *= 1 - drop.absorbed
          drop.absorbed = 0
          plan(drop, index, now, false)
        }
      }
      for (const from of [...pills.keys()]) {
        if (from !== index) emit(from, index, now)
      }
      if (entering) emit(-1, index, now)
      wake()
    }

    const resizeObserver = new ResizeObserver(() => {
      measure()
      if (!drops.length) settle(target)
      else render()
    })
    resizeObserver.observe(stage)
    resizeObserver.observe(list)

    measure()
    settle(indexRef.current)
    stage.dataset.gooey = ''
    document.fonts?.ready.then(() => {
      if (disposed) return
      measure()
      if (!drops.length) settle(target)
    })

    engineRef.current = go

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      delete stage.dataset.gooey
      gl.deleteBuffer(pipeline.buffer)
      gl.deleteProgram(pipeline.program)
      engineRef.current = null
    }
  }, [animate, items.length])

  // The shared layout stays mounted during navigation, including back and forward.
  useLayoutEffect(() => {
    indexRef.current = activeIndex
    engineRef.current?.(activeIndex)
  }, [activeIndex])

  return (
    <div className="relative isolate p-1 text-sm xl:text-base">
      <GlassSurface visible className="inset-0 rounded-full group-data-scrolled/header:opacity-0" />
      <div ref={stageRef} className="group/gooey relative">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute hidden group-data-gooey/gooey:block motion-reduce:hidden"
          aria-hidden="true"
        />
        <ul ref={listRef} className="relative flex">
          {items.map(({ href, destination, label }, index) => {
            const active = index === activeIndex
            return (
              <li key={destination}>
                {destination === '/course' ? (
                  <CourseDropdown catalog={{ href, destination, label }} items={courseLinks} activeCoursePath={activeCoursePath} active={active} />
                ) : (
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    data-gtm={destination === '/contacts' ? 'nav-contacts' : 'nav-link'}
                    data-gtm-destination={destination}
                    className={`${linkClass} text-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      active ? 'bg-red-600 motion-safe:group-data-gooey/gooey:bg-transparent' : 'hover:text-brand-red motion-safe:transition-colors'
                    }`}
                  >
                    {label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
        <ul
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 hidden text-white group-data-gooey/gooey:flex motion-reduce:hidden"
          aria-hidden="true"
        >
          {items.map(({ destination, label }) => (
            <li key={destination}>
              <span className={destination === '/course' ? `${linkClass} gap-1.5` : linkClass}>
                {label}
                {destination === '/course' && <ChevronDown className="size-3.5 shrink-0" />}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
