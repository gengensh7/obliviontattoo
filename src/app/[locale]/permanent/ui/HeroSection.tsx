import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import brows from '../../../../../public/images/permanentPage/permanent-brovi-kishinev.webp'
import eyelids from '../../../../../public/images/permanentPage/permanent-resniti-kishinev.webp'
import lips from '../../../../../public/images/permanentPage/permanent-guby-kishinev.webp'
import { HeroServices, type HeroService } from './HeroServices'
import type { PermanentCardData } from './ProductCard'

const serviceImages = { brows, lips, eyelids }

export const HeroSection = () => {
  const t = useTranslations('permanentPage')
  const summaries = t.raw('heroSection.subtitles') as (Pick<HeroService, 'title' | 'text'> & {
    id: keyof typeof serviceImages
  })[]
  const details = t.raw('serviceSection.services') as PermanentCardData[]
  const services = summaries.map(({ id, title, text }) => ({
    id,
    title,
    text,
    image: serviceImages[id],
    alt: details.find((service) => service.id === id)?.alt ?? title
  }))

  return (
    <section
      aria-labelledby="permanent-hero-title"
      className="bg-zinc-950 pt-28 pb-12 text-white selection:bg-rose-200 selection:text-zinc-950 lg:pt-30 lg:pb-16 xl:pt-36 xl:pb-20 2xl:pt-38 2xl:pb-24"
    >
      <div className="container grid gap-6 md:max-lg:max-w-2xl lg:grid-cols-2 lg:grid-rows-[1fr_auto] lg:items-start lg:gap-x-10 lg:gap-y-9 xl:gap-x-14 xl:gap-y-12">
        <div className="grid gap-4 lg:col-start-1 lg:row-start-1 lg:gap-6 lg:pt-6 xl:pt-8">
          <h1
            id="permanent-hero-title"
            className="text-3xl/none font-bold tracking-tight min-[360px]:max-sm:text-[40px]/none sm:text-6xl/none lg:text-5xl/none xl:text-[68px]/none 2xl:text-[82px]/none"
          >
            <span className="block overflow-clip py-1">
              <span className="montserrat block motion-safe:animate-permanent-title">
                {t.rich('heroSection.title', {
                  location: (chunks) => (
                    <span className="montserrat block pt-2 text-xl/none font-normal text-rose-200 min-[360px]:max-sm:text-2xl/none sm:text-3xl/none xl:text-4xl/none">
                      {chunks}
                    </span>
                  )
                })}
              </span>
            </span>
          </h1>
          <div className="grid justify-items-start gap-4 motion-safe:animate-permanent-intro lg:gap-6">
            <p className="max-w-md leading-relaxed text-zinc-300 lg:text-lg/normal">{t('heroSection.text')}</p>
            <a
              href={CONTACT_TELEGRAM}
              data-gtm="telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-between gap-3 rounded-lg bg-rose-200 px-3.5 py-2.5 text-sm/tight font-bold text-zinc-950 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-200 motion-safe:transition-transform motion-safe:duration-120 motion-safe:ease-permanent motion-safe:active:scale-98 motion-safe:active:duration-160 sm:gap-4 sm:px-4 lg:text-base/tight"
            >
              {t('heroSection.button')}
              <ArrowUpRight aria-hidden="true" className="shrink-0" size={19} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <HeroServices services={services} />
      </div>
    </section>
  )
}
