'use client'

import { ArrowDown } from 'lucide-react'
import Image, { type StaticImageData } from 'next/image'
import { useState } from 'react'

export type HeroService = {
  id: string
  title: string
  text: string
  image: StaticImageData
  alt: string
}

type Input = 'initial' | 'pointer' | 'keyboard'

const previewSizes =
  '(min-width: 1536px) 725px, (min-width: 1280px) 596px, (min-width: 1024px) 476px, (min-width: 768px) 640px, (min-width: 512px) 608px, (min-width: 420px) 480px, (min-width: 360px) 388px, 328px'
export function HeroServices({ services }: { services: HeroService[] }) {
  const [selection, setSelection] = useState({ index: 0, fallback: 0, input: 'initial' as Input })
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const { index, input } = selection
  const visible = loaded[index] ? index : selection.fallback

  function select(next: number, input: Input) {
    setSelection({ index: next, fallback: visible, input })
  }

  return (
    <>
      <figure className="relative isolate aspect-5/3 overflow-hidden rounded-lg bg-zinc-900 md:max-lg:aspect-video lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:min-h-136 lg:self-stretch xl:min-h-150 2xl:min-h-172">
        {services.map((service, position) => (
          <div
            key={service.id}
            className={`absolute inset-0 ${position === visible ? '' : 'invisible'}`}
            aria-hidden={position !== visible}
          >
            <Image
              className="object-cover"
              src={service.image}
              alt={service.alt}
              fill
              sizes={previewSizes}
              placeholder={position === 0 ? 'blur' : 'empty'}
              fetchPriority={position === 0 ? 'high' : 'low'}
              loading="eager"
              onLoad={() => setLoaded((ready) => ({ ...ready, [position]: true }))}
            />
          </div>
        ))}
      </figure>

      <ul
        className="border-t border-zinc-300/20 lg:col-start-1 lg:row-start-2"
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse' && input === 'pointer') select(0, 'pointer')
        }}
        onBlur={(event) => {
          if (input === 'keyboard' && !event.currentTarget.contains(event.relatedTarget)) {
            select(0, 'keyboard')
          }
        }}
      >
        {services.map((service, position) => (
          <li key={service.id}>
            <a
              href={`#${service.id}`}
              className="relative flex min-h-17 items-center gap-3 border-b border-zinc-300/20 py-2.5 ps-2 pe-1.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rose-200 lg:gap-5"
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                  select(position, 'pointer')
                }
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible')) select(position, 'keyboard')
              }}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-2 inset-s-0 w-0.5 origin-center bg-rose-200 ${position === index ? 'scale-y-100' : 'scale-y-0'} ${input === 'pointer' ? 'motion-safe:transition-transform motion-safe:duration-160' : ''}`}
              />
              <span className="relative h-10 w-14.5 shrink-0 overflow-hidden rounded-sm bg-zinc-900">
                <Image className="object-cover" src={service.image} alt="" fill sizes="58px" loading={position === 0 ? 'eager' : 'lazy'} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-x-3.5 lg:flex-row lg:items-baseline">
                <span
                  className={`montserrat text-base font-bold tracking-tight lg:w-35 lg:shrink-0 lg:text-xl ${position === index ? 'text-rose-200' : ''}`}
                >
                  {service.title}
                </span>
                <span className="text-sm/snug text-zinc-300">{service.text}</span>
              </span>
              <ArrowDown className="shrink-0 text-zinc-300" aria-hidden="true" size={20} strokeWidth={1.5} />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
