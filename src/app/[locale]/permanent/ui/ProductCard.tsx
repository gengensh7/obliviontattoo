import Image from 'next/image'
import { Card3D, Card3DBody, Card3DItem } from '@/components/ui/card-3d'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FoldText from '@/shared/FoldText'

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
    <article id={item.id} tabIndex={-1} className="permanent-service-card min-w-0 scroll-mt-28 rounded-2xl">
      <Card3D className="h-full">
        <Card3DBody className="permanent-service-card-body flex h-full w-full flex-col gap-6 rounded-2xl border border-white/10 bg-zinc-800 p-4 shadow-xl shadow-black/30 sm:p-5">
          <div className="relative aspect-4/3 shrink-0">
            <Card3DItem
              aria-hidden="true"
              translateZ={18}
              className="pointer-events-none absolute inset-x-0 top-0 -bottom-1 rounded-xl border border-white/15 bg-zinc-950 shadow-md shadow-black/50"
            />
            <Card3DItem translateZ={48} className="absolute inset-0 rounded-xl bg-zinc-900 shadow-lg shadow-black/40">
              <Image
                className="permanent-service-photo rounded-xl object-cover"
                src={image}
                fill
                sizes="(min-width: 1536px) 445px, (min-width: 1280px) 360px, (min-width: 1024px) 446px, (min-width: 768px) 310px, (min-width: 640px) 596px, calc(100vw - 48px)"
                loading={item.id === 'brows' ? 'eager' : 'lazy'}
                fetchPriority="low"
                alt={item.alt}
              />
            </Card3DItem>
            <Card3DItem translateZ={60} className="absolute right-3 bottom-3 rounded-sm bg-zinc-950 px-2.5 py-1.5 text-xs font-semibold tracking-wider text-zinc-100 uppercase">
              {item.badge}
            </Card3DItem>
          </div>

          <Card3DItem translateZ={8} className="flex grow flex-col gap-5">
            <div className="flex grow flex-col gap-3">
              <h3 className="text-xl/tight font-semibold tracking-tight text-balance text-white sm:text-2xl/tight">
                <FoldText text={item.title} />
              </h3>
              <p className="text-sm/6 text-zinc-300">{item.text}</p>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
              <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm text-zinc-300">
                <span>{item.priceTitle}</span>
                <strong className="text-xl font-semibold whitespace-nowrap text-white tabular-nums">{item.price}</strong>
              </p>

              <CtaLink
                href={CONTACT_TELEGRAM}
                data-gtm="telegram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                {item.button}
              </CtaLink>
            </div>
          </Card3DItem>
        </Card3DBody>
      </Card3D>
    </article>
  )
}
