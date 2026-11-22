import { ArrowRight, Clock3, GraduationCap, Package, UsersRound } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { courses } from '@/lib/courses'
import { cn } from '@/lib/utils'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { ScrollCtaLink } from '@/shared/ScrollCtaLink'
import { CourseSparkles } from './CourseSparkles'

const benefits = [
  { key: 'practice', Icon: UsersRound },
  { key: 'materials', Icon: Package },
  { key: 'diploma', Icon: GraduationCap }
] as const

const linkStyle = 'inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-zinc-300 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red motion-safe:transition-colors'
const comparisonId = 'compare-courses'

export async function HeroSection({ locale }: { locale: string }) {
  const t = await getTranslations('coursesPage')

  return (
    <div className="bg-zinc-900 text-white selection:bg-rose-800 selection:text-white">
      <section aria-labelledby="course-hero-title" className="course-hero relative isolate flex h-dvh flex-col overflow-clip pt-25 sm:pt-28 lg:pt-30">
        <CourseSparkles />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <FadeContent
            effect="focus"
            trigger="mount"
            duration={0.52}
            initialOpacity={0.8}
            className="container flex grow flex-col justify-center gap-4 py-5 sm:gap-5 sm:py-8"
          >
            <div className="grid w-full gap-4 lg:grid-cols-12 lg:gap-x-6">
              <h1 id="course-hero-title" className="service-hero-title font-bold tracking-tight text-balance lg:col-span-11 xl:col-span-10">
                <FoldText text={t('hero.title')} />
              </h1>
              <p className="text-base/relaxed text-zinc-300 sm:text-lg/relaxed lg:col-span-8 xl:col-span-6">
                {t('hero.lead')}
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" target="_blank" rel="noopener noreferrer" className="grow px-3 sm:grow-0 sm:px-5">
                  {t('cta')}
                </CtaLink>
                <ScrollCtaLink targetId={comparisonId} className="grow px-3 sm:grow-0 sm:px-5">
                  {t('hero.compare')}
                </ScrollCtaLink>
              </div>
              <ul className="flex flex-wrap gap-1.5 text-xs/5 text-zinc-200 sm:gap-2 sm:text-sm/5">
                {benefits.map(({ key, Icon }) => (
                  <li key={key} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/50 px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
                    <Icon aria-hidden="true" className="size-3.5 shrink-0 text-brand-red sm:size-4" />
                    {t(`hero.benefits.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </FadeContent>
        </div>
      </section>

      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col gap-3 pb-16 lg:pb-20">
        <div id={comparisonId} role="region" aria-label={t('hero.compare')} tabIndex={-1} className="grid scroll-mt-26 grid-cols-1 gap-3.5 rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {courses.map(({ key, price, service, tracking }) => {
            const featured = key === 'tattoo'
            const short = key === 'piercing'
            const title = t(`types.${key}.title`)
            const titleId = `${key}-course-title`

            return (
              <section
                key={key}
                id={`${key}-course`}
                aria-labelledby={titleId}
                className={cn(
                  'flex min-w-0 scroll-mt-26 flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-4 shadow-lg shadow-black/15 hover:border-white/25 motion-safe:transition-colors motion-safe:duration-150 sm:p-5 xl:p-6',
                  featured
                    ? 'gap-4 border-rose-200/20 bg-linear-to-br from-zinc-800 to-zinc-900 sm:p-6 md:col-span-2 lg:col-span-7 lg:row-span-2 lg:gap-5 lg:p-8 xl:p-8'
                    : 'lg:col-span-5'
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3 sm:gap-5">
                    <h2 id={titleId} className={cn('min-w-0 text-xl/tight font-bold tracking-tight wrap-break-word', featured ? 'sm:text-3xl lg:text-4xl' : 'sm:text-2xl/tight')}>
                      <FoldText text={title} subtle />
                    </h2>
                    <p className={cn('shrink-0 font-bold tracking-tight whitespace-nowrap text-brand-red tabular-nums', featured ? 'text-3xl/none lg:text-5xl/none' : 'text-2xl/none')}>
                      {t('fee', { price })}
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-sm/5 font-medium text-zinc-200">
                    <Clock3 aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
                    {t(short ? 'shortDuration' : 'longDuration')}
                  </p>
                </div>

                <div className={cn('flex flex-col gap-2.5', !featured && 'grow')}>
                  <p className={cn('text-sm/5 text-zinc-100', featured && 'sm:text-base/6')}>
                    {t(`types.${key}.summary`)}
                  </p>
                  <ul className="flex list-disc flex-col gap-1 ps-4 text-sm/5 text-zinc-300 marker:text-brand-red">
                    <li>{t(short ? 'shortSchedule' : 'longSchedule')}</li>
                    <li>{t(`types.${key}.theory`)}</li>
                    <li>{t(short ? 'jewellery' : 'materials')}</li>
                  </ul>
                </div>

                {featured && (
                  <div className="relative h-28 grow overflow-hidden rounded-lg bg-zinc-800 sm:h-40 lg:min-h-36">
                    <Image
                      src="/images/homePage/hero-section/hero-1.webp"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover object-center brightness-75 grayscale"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-zinc-950/40 to-transparent" />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/10 pt-3">
                  <CtaLink
                    href={CONTACT_TELEGRAM}
                    data-gtm="telegram"
                    data-gtm-course={tracking}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('hero.cardCta')} · ${title}`}
                  >
                    {t('hero.cardCta')}
                  </CtaLink>
                  <Link href={getPathname({ locale, href: service })} className={linkStyle}>
                    {t(`types.${key}.link`)}
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                  </Link>
                </div>
              </section>
            )
          })}
        </div>

        <Link href={getPathname({ locale, href: '/gallery' })} className={cn(linkStyle, 'self-start')}>
          {t('gallery')}
          <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
        </Link>
      </FadeContent>
    </div>
  )
}
