import Image from 'next/image'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FoldText from '@/shared/FoldText'
import type { slides, HeroSliderProps } from './heroSlides'

export const HeroSlide = ({ slide, card, preload = false, active = false }: {
  slide: (typeof slides)[number]
  card: HeroSliderProps['cards']['firstCard']
  preload?: boolean
  active?: boolean
}) => (
  <div className="relative min-h-screen w-full">
    <Image
      src={slide.imageSrc}
      alt={card.imageAlt}
      fill
      draggable={false}
      preload={preload}
      quality={60}
      sizes="100vw"
      className="object-cover grayscale"
    />

    <div className="pointer-events-none absolute inset-0 z-10 bg-black/50" />

    <div className="relative z-20 container flex min-h-screen items-center justify-center py-28">
      <div className="flex w-full flex-col gap-6 text-white">
        <p className="text-3xl font-bold md:text-5xl"><FoldText text={card.title} subtle active={active} /></p>

        <p className="text-2xl font-bold lg:text-8xl"><FoldText text={card.text} active={active} /></p>

        <p className="max-w-3xl text-lg">{card.description}</p>

        <CtaLink
          href={CONTACT_TELEGRAM}
          data-gtm="telegram"
          data-gtm-slide={slide.key}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit"
        >
          {card.button}
        </CtaLink>
      </div>
    </div>
  </div>
)
