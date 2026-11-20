import Image from 'next/image'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'

export type PermanentCardData = {
  badge: string
  title: string
  text: string
  id: string
  alt: string
  priceTitle: string
  price: string
  button: string
}

type Props = {
  item: PermanentCardData
  image: string
}

export const ProductCard = ({ item, image }: Props) => {
  return (
    <article id={item.id} className="group scroll-mt-28 flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-br from-rose-500/20 via-rose-500/10 to-transparent backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-rose-500/20">
      <div className="relative aspect-4/3 h-100 shrink-0">
        <div className="absolute top-4 left-4 z-2">
          <span className="flex items-center rounded-full bg-black/30 px-3 py-1 font-medium text-white backdrop-blur-sm">✨ {item.badge}</span>
        </div>
        <Image
          className="object-cover"
          src={image}
          fill
          sizes="(min-width: 1536px) 461px, (min-width: 1280px) 376px, (min-width: 1024px) 466px, (min-width: 768px) 338px, (min-width: 640px) 608px, calc(100vw - 32px)"
          fetchPriority="low"
          alt={item.alt}
        />
      </div>

      <div className="flex grow flex-col gap-6 p-4 sm:p-6">
        <div className="flex grow flex-col gap-4">
          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-rose-100">{item.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-300">{item.text}</p>
        </div>

        <p className="mt-auto text-zinc-300">
          {item.priceTitle}{' '}
          <strong className="text-lg text-rose-300">{item.price}</strong>
        </p>

        <a
          href={CONTACT_TELEGRAM}
          data-gtm="telegram"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto w-full rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-2 py-3 text-center text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-500/25 sm:px-4"
        >
          {item.button}
        </a>
      </div>
    </article>
  )
}
