import { Gem, Layers2, PenTool } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { Vortex } from '@/components/ui/vortex'
import { getPathname } from '@/i18n/navigation'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { HeroCard, type HeroCardData } from './HeroCard'

export const HeroSection = async () => {
  const [t, locale] = await Promise.all([getTranslations('tattooPage.heroSection'), getLocale()])
  const [styles, coverUp, customDesign] = t.raw('heroCards') as [HeroCardData, HeroCardData, HeroCardData]

  return (
    <section
      aria-labelledby="tattoo-hero-title"
      className="tattoo-hero relative isolate flex min-h-svh items-center overflow-hidden bg-zinc-900 text-white selection:bg-rose-200 selection:text-zinc-950"
    >
      <Vortex
        className="tattoo-hero-vortex"
        particleCount={520}
        rangeY={210}
        baseHue={335}
        rangeHue={34}
        baseSpeed={0.6}
        rangeSpeed={1.5}
        baseRadius={0.85}
        rangeRadius={1.45}
      />

      <FadeContent
        effect="focus"
        trigger="mount"
        duration={0.52}
        initialOpacity={0.8}
        className="container relative flex flex-col gap-9 pt-28 pb-12 sm:gap-11 sm:pt-32 lg:gap-12 lg:pt-36 lg:pb-16"
      >
        <div className="flex flex-col items-start gap-5">
          <h1
            id="tattoo-hero-title"
            className="service-hero-title font-extrabold tracking-tight text-balance"
          >
            <FoldText text={t('title')} />
          </h1>
          <p className="text-base/relaxed text-pretty text-zinc-200 sm:text-lg/relaxed">
            {t('subtitle')}
          </p>
          <div className="flex w-full flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex flex-wrap gap-3">
              <CtaLink
                href={CONTACT_TELEGRAM}
                data-gtm="telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('book')}
              </CtaLink>
              <CtaLink href={getPathname({ locale, href: '/gallery' })} data-gtm="tattoo-hero-view-gallery">
                {t('gallery')}
              </CtaLink>
            </div>
            <p className="text-sm/relaxed text-zinc-300 sm:border-l sm:border-white/20 sm:pl-6">
              {t.rich('startingPrice', {
                price: (chunks) => <strong className="font-semibold text-white">{chunks}</strong>
              })}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-flow-col md:grid-cols-2 md:grid-rows-2 lg:grid-cols-12 lg:gap-4">
          <HeroCard item={styles} Icon={Gem} featured />
          <HeroCard item={coverUp} Icon={Layers2} />
          <HeroCard item={customDesign} Icon={PenTool} />
        </div>
      </FadeContent>
    </section>
  )
}
