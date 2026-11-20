import { useTranslations } from 'next-intl'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import GradientText from '@/shared/GradientText'
import brows from '../../../../../public/images/permanentPage/permanent-brovi-kishinev.webp'
import eyelids from '../../../../../public/images/permanentPage/permanent-resniti-kishinev.webp'
import lips from '../../../../../public/images/permanentPage/permanent-guby-kishinev.webp'
import { HeroServices, type HeroService } from './HeroServices'
import type { PermanentCardData } from './ProductCard'

const serviceImages = { brows, lips, eyelids }
const titleColors = ['#ffffff', '#fbcfe8', '#f472b6', '#c084fc']

const beamPaths = [
  'M -80 620 C 360 640 525 485 795 290 S 1210 65 1500 90',
  'M -80 680 C 340 713 540 511 817 324 S 1235 121 1500 162',
  'M -80 740 C 373 772 555 547 852 364 S 1264 188 1500 235',
  'M -80 805 C 410 822 583 580 895 410 S 1296 255 1500 309',
  'M -80 873 C 416 867 626 613 935 468 S 1306 326 1500 384'
]

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
      className="permanent-hero relative isolate grid min-h-svh items-center bg-zinc-950 pt-28 pb-14 text-white selection:bg-rose-200 selection:text-zinc-950 lg:pt-32 lg:pb-16"
    >
      <div aria-hidden="true" className="permanent-hero-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden forced-colors:hidden">
        <svg className="permanent-hero-beams absolute inset-0 size-full fill-none" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
          {beamPaths.map((path, index) => (
            <g key={path}>
              <path d={path} vectorEffect="non-scaling-stroke" className="stroke-rose-200/12" />
              {index % 2 === 0 && (
                <path d={path} pathLength={100} vectorEffect="non-scaling-stroke" className="permanent-hero-beam invisible stroke-rose-300/45" />
              )}
            </g>
          ))}
        </svg>
      </div>

      <FadeContent effect="focus" trigger="mount" duration={0.52} initialOpacity={0.8} className="container grid gap-8">
        <div className="grid min-w-0 justify-items-center gap-5 text-center">
          <h1
            id="permanent-hero-title"
            className="w-fit max-w-full text-2xl/tight font-bold tracking-tight text-balance sm:text-5xl/tight lg:text-6xl/none xl:text-7xl/none"
          >
            {t.rich('heroSection.title', {
              treatment: (chunks) => <GradientText colors={titleColors} className="montserrat">{chunks}</GradientText>,
              location: (chunks) => (
                <FoldText
                  text={String(chunks)}
                  className="montserrat block pt-2 text-xl/tight font-normal tracking-normal text-white sm:text-2xl/tight lg:text-3xl/tight"
                />
              )
            })}
          </h1>
          <div className="grid justify-items-center gap-5">
            <p className="max-w-xl leading-relaxed text-zinc-300 text-pretty lg:text-lg/relaxed">{t('heroSection.text')}</p>
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
