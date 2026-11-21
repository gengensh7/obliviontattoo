import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Carousel } from '@/components/ui/apple-cards-carousel'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

const charts = [
  { category: 'ears', image: 1, altIndex: 0 },
  { category: 'nose', image: 2, altIndex: 1 },
  { category: 'other', image: 3, altIndex: 3 },
  { category: 'lips', image: 4, altIndex: 2 }
] as const

export const LatestPiercingSection = async () => {
  const locale = await getLocale()
  const t = await getTranslations('piercingPage.latestPiercingSection')
  const alts = t.raw('imageAlts') as string[]
  const contactsHref = getPathname({ locale, href: '/contacts' })

  return (
    <section aria-labelledby="piercing-charts-title" className="bg-zinc-900 py-14 sm:py-20">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col gap-6 sm:gap-9">
        <div className="grid gap-3 lg:grid-cols-5 lg:items-end lg:gap-12">
          <h2 id="piercing-charts-title" className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:col-span-3 xl:text-5xl">
            <FoldText text={t('title')} />
          </h2>
          <p className="text-pretty text-zinc-300 lg:col-span-2">{t('description')}</p>
        </div>

        <Carousel
          previous={t('previous')}
          next={t('next')}
          action={<CtaLink href={contactsHref} data-gtm="piercing-contacts">{t('contactsLink')}</CtaLink>}
          items={charts.map(({ category, image, altIndex }) => (
            <figure
              key={category}
              className="flex w-5/6 shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-zinc-950 text-white ring-1 ring-white/10 ring-inset sm:w-5/12 lg:w-3/10"
            >
              <figcaption className="montserrat flex min-h-16 items-center px-4 py-2 text-base font-bold leading-tight sm:px-5 sm:text-lg">
                <FoldText text={t(`cardTitles.${category}`)} subtle />
              </figcaption>
              <Image
                src={`/images/piercingPage/piercing-price-${image}.webp`}
                alt={alts[altIndex]}
                width={1024}
                height={1536}
                draggable={false}
                sizes="(min-width: 1536px) 452px, (min-width: 1024px) 29vw, (min-width: 640px) 41vw, 83vw"
                className="h-auto w-full"
              />
            </figure>
          ))}
        />
      </FadeContent>
    </section>
  )
}
