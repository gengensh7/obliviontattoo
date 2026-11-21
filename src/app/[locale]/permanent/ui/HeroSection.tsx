import { useTranslations } from 'next-intl'
import { CtaLink } from '@/components/ui/cta-link'
import { MorphicBackground } from '@/components/ui/morhic-background'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import GradientText from '@/shared/GradientText'
import { HeroServices, type HeroService } from './HeroServices'
import type { PermanentCardData } from './ProductCard'

const serviceImages = {
  brows: '/images/permanentPage/permanent-brovi-kishinev.webp',
  lips: '/images/permanentPage/permanent-guby-kishinev.webp',
  eyelids: '/images/permanentPage/permanent-resniti-kishinev.webp'
}
const titleColors = ['#ffffff', '#fbcfe8', '#f472b6', '#c084fc']

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
      className="permanent-hero permanent-hero-shell relative isolate text-white selection:bg-rose-200 selection:text-zinc-950"
    >
      <div aria-hidden="true" className="permanent-hero-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden forced-colors:hidden">
        <MorphicBackground ballColor="#a6608f" />
      </div>

      <FadeContent effect="focus" trigger="mount" duration={0.52} initialOpacity={0.8} className="container permanent-hero-layout">
        <div className="grid min-w-0 justify-items-start gap-5 sm:gap-8 lg:col-span-5">
          <h1
            id="permanent-hero-title"
            className="service-hero-title max-w-full font-semibold tracking-tight sm:max-w-lg"
          >
            {t.rich('heroSection.title', {
              treatment: (chunks) => (
                <GradientText colors={titleColors} className="montserrat text-pretty">
                  <FoldText text={String(chunks)} />
                </GradientText>
              ),
              location: (chunks) => (
                <FoldText
                  text={String(chunks)}
                  className="montserrat block pt-2 text-xl/tight font-normal tracking-normal text-rose-100 sm:pt-3 sm:text-2xl/tight xl:text-3xl/tight"
                />
              )
            })}
          </h1>
          <div className="grid justify-items-start gap-4 sm:gap-6">
            <div aria-hidden="true" className="h-px w-12 bg-rose-300/65" />
            <p className="max-w-sm text-pretty leading-relaxed text-zinc-300 lg:text-lg/relaxed">{t('heroSection.text')}</p>
            <CtaLink
              href={CONTACT_TELEGRAM}
              data-gtm="telegram"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('heroSection.button')}
            </CtaLink>
          </div>
        </div>

        <HeroServices services={services} />
      </FadeContent>
    </section>
  )
}
