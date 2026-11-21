import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import FoldText from '@/shared/FoldText'

export type HeroService = {
  id: string
  title: string
  text: string
  image: string
  alt: string
}

const featureSizes = '(min-width: 1536px) 572px, (min-width: 1280px) 472px, (min-width: 1024px) 376px, (min-width: 768px) 480px, (min-width: 640px) 402px, calc(100vw - 32px)'
const detailSizes = '(min-width: 1536px) 350px, (min-width: 1280px) 290px, (min-width: 1024px) 230px, (min-width: 768px) 300px, (min-width: 640px) 250px, calc(50vw - 20px)'

export function HeroServices({ services }: { services: HeroService[] }) {
  return (
    <ul className="permanent-hero-services">
      {services.map((service) => (
        <li key={service.id} data-service={service.id}>
          <a
            href={`#${service.id}`}
            className="group relative isolate flex flex-col justify-end overflow-hidden rounded-md bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-200"
          >
            <div className="absolute inset-x-0 top-0 bottom-6 -z-10 mask-b-from-85% mask-b-to-100% sm:bottom-0 sm:mask-none">
              <Image
                className="object-cover"
                src={service.image}
                alt={service.alt}
                fill
                sizes={service.id === 'brows' ? featureSizes : detailSizes}
                loading={service.id === 'brows' ? 'eager' : 'lazy'}
                fetchPriority={service.id === 'brows' ? 'high' : undefined}
              />
            </div>
            <div className="permanent-hero-caption grid gap-1 bg-linear-to-t from-zinc-950 via-zinc-950/80 via-40% to-transparent px-3 pt-8 pb-3 sm:px-4 sm:pt-16 sm:pb-4">
              <div className="flex items-baseline justify-between gap-1">
                <h2 className="text-base/tight font-semibold tracking-tight sm:text-xl/tight">
                  <FoldText text={service.title} subtle />
                </h2>
                <ArrowDown aria-hidden="true" size={16} strokeWidth={1.5} className="shrink-0 self-center text-rose-200 group-hover:text-white group-focus-visible:text-white" />
              </div>
              <p className="text-sm/snug text-rose-50/90">{service.text}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
