'use client'

import Image, { type StaticImageData } from 'next/image'
import { ArrowDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Card3D, Card3DBody, Card3DItem } from '@/components/ui/card-3d'

export type HeroService = {
  id: string
  title: string
  text: string
  image: StaticImageData
  alt: string
}

const imageSizes =
  '(min-width: 1536px) 432px, (min-width: 1280px) 355px, (min-width: 1024px) 292px, (min-width: 768px) 205px, (min-width: 480px) 414px, calc(100vw - 82px)'

export function HeroServices({ services }: { services: HeroService[] }) {
  const serviceList = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const hero = serviceList.current?.closest('section')
    if (!hero) return

    let inView = false
    const updateMotion = () => hero.toggleAttribute('data-motion-visible', inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      updateMotion()
    })

    observer.observe(hero)
    document.addEventListener('visibilitychange', updateMotion)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateMotion)
      hero.removeAttribute('data-motion-visible')
    }
  }, [])

  return (
    <ul ref={serviceList} className="permanent-hero-services mx-auto grid w-full max-w-md gap-6 px-2 md:max-w-none md:grid-cols-3 md:gap-5 md:px-0 lg:gap-8 xl:gap-10">
      {services.map((service, position) => (
        <li key={service.id} data-service={service.id} className="min-w-0 md:odd:pt-6 md:even:pb-6 lg:odd:pt-9 lg:even:pb-9">
          <a
            href={`#${service.id}`}
            className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-200"
          >
            <Card3D className="h-full">
              <Card3DBody className="permanent-hero-card flex h-full w-full flex-col gap-4 rounded-2xl border border-rose-100/20 bg-linear-to-b from-zinc-800 to-zinc-950 p-4 lg:gap-5 lg:p-5">
                <Card3DItem translateZ={64} className="relative aspect-4/3 rounded-xl bg-zinc-900 shadow-lg shadow-black/40">
                  <Image
                    className="rounded-xl object-cover"
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes={imageSizes}
                    placeholder="blur"
                    loading={position === 0 ? 'eager' : 'lazy'}
                    fetchPriority={position === 0 ? 'high' : undefined}
                  />
                </Card3DItem>
                <div className="flex flex-1 items-center justify-between gap-2 lg:gap-4">
                  <div className="grid min-w-0 transform-3d gap-1">
                    <Card3DItem translateZ={42}>
                      <h2 className="text-xl/tight font-semibold tracking-tight lg:text-2xl/tight">{service.title}</h2>
                    </Card3DItem>
                    <Card3DItem translateZ={24}>
                      <p className="text-sm/snug text-zinc-300 lg:text-base/snug">{service.text}</p>
                    </Card3DItem>
                  </div>
                  <Card3DItem
                    translateZ={52}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-rose-100/25 text-rose-100 group-hover:border-rose-200/55 group-focus-visible:border-rose-200/55 lg:size-11"
                  >
                    <ArrowDown aria-hidden="true" size={18} strokeWidth={1.5} />
                  </Card3DItem>
                </div>
              </Card3DBody>
            </Card3D>
          </a>
        </li>
      ))}
    </ul>
  )
}
