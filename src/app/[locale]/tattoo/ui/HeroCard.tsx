import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { cn } from '@/lib/utils'
import FoldText from '@/shared/FoldText'

export type HeroCardData = {
  title: string
  text: string
  button: string
}

type Props = {
  item: HeroCardData
  Icon: LucideIcon
  featured?: boolean
}

export const HeroCard = ({ item, Icon, featured = false }: Props) => (
  <article
    className={cn(
      'relative isolate flex min-w-0 flex-col items-start justify-between gap-2 rounded-2xl border border-white/12 bg-zinc-950/35 px-5 py-4 backdrop-blur-xs',
      'focus-within:border-white/25 hover:border-white/25 hover:bg-zinc-950/50',
      featured
        ? 'min-h-54 gap-5 p-5 md:row-span-2 md:p-6 lg:col-span-7 lg:p-8'
        : 'lg:col-span-5 lg:px-6'
    )}
  >
    {featured && (
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-3/5 overflow-hidden rounded-r-2xl mask-l-from-35% mask-l-to-100%">
        <Image
          src="/images/homePage/hero-section/hero-2.webp"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1536px) 520px, (min-width: 1024px) 33vw, (min-width: 768px) 28vw, 60vw"
          className="object-cover object-center opacity-40 grayscale lg:opacity-60"
        />
      </div>
    )}
    <div className={cn('flex flex-col gap-2', featured && 'gap-3 lg:w-3/5')}>
      <div className={cn('flex items-start gap-2.5', featured && 'flex-col gap-3')}>
        <Icon aria-hidden="true" className={cn('text-brand-red size-5 shrink-0', featured && 'size-7')} strokeWidth={1.75} />
        <h2 className={cn('text-base/snug font-semibold sm:text-lg/snug', featured && 'text-2xl/tight sm:text-3xl/tight')}>
          <FoldText text={item.title} subtle />
        </h2>
      </div>
      <p className={cn('text-sm/relaxed text-zinc-200', featured && 'text-base/relaxed')}>{item.text}</p>
    </div>
    <a
      href={CONTACT_TELEGRAM}
      data-gtm="telegram"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm/5 font-semibold text-white hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 motion-safe:transition-colors"
    >
      {item.button}
      <ArrowUpRight aria-hidden="true" className="text-brand-red size-4 shrink-0" />
    </a>
  </article>
)
