import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { CtaLink } from '@/components/ui/cta-link'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import type { Course } from '@/lib/courses'
import { buildCoursePageJsonLd } from '@/lib/jsonld'
import { cn } from '@/lib/utils'
import { PermanentHeroBackground, PiercingHeroBackground, TattooHeroBackground } from '@/shared/ServiceHeroBackgrounds'

type ContentRow = { title: string; text: string }
type CourseSectionProps = { course: Course; locale: AppLocale }

const headingClass = 'text-3xl/tight font-bold tracking-tight text-balance text-white sm:text-4xl/tight lg:col-span-4'
const courseHeroBackgrounds = {
  tattoo: { Background: TattooHeroBackground, surface: 'tattoo-hero bg-zinc-900' },
  permanent: { Background: PermanentHeroBackground, surface: 'bg-zinc-950' },
  piercing: { Background: PiercingHeroBackground, surface: 'bg-zinc-950' }
}

export async function CourseHero({ course, locale }: CourseSectionProps) {
  const t = await getTranslations({ locale, namespace: 'coursesPage' })
  const detail = `details.${course.key}` as const
  const { Background, surface } = courseHeroBackgrounds[course.key]

  return (
    <section aria-labelledby="course-title" className={cn('relative isolate grid min-h-screen overflow-hidden', surface)}>
      <Background />
      <div className="container relative z-10 flex flex-col gap-5 pt-24 pb-12 sm:gap-7 sm:pt-28 sm:pb-16">
        <nav aria-label={t('details.breadcrumbLabel')} className="text-sm text-zinc-400">
          <ol className="flex flex-wrap items-center gap-x-2.5">
            <li>
              <Link href="/course" className="inline-flex min-h-11 items-center rounded-sm font-medium text-zinc-200 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red motion-safe:transition-colors motion-safe:duration-150">
                {t('details.catalog')}
              </Link>
            </li>
            <li aria-current="page" className="inline-flex items-center gap-2.5">
              <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
              {t(`${detail}.menu`)}
            </li>
          </ol>
        </nav>

        <div className="grid grow content-center items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="grid min-w-0 justify-items-start gap-5 sm:gap-6 lg:col-span-6">
            <h1 id="course-title" className="text-3xl/tight font-bold tracking-tight text-balance wrap-anywhere text-white sm:text-5xl/tight 2xl:text-6xl/tight">
              {t(`${detail}.title`)}
            </h1>
            <p className="text-lg/relaxed text-zinc-300 lg:w-11/12">{t(`${detail}.lead`)}</p>
            <dl className="flex w-full flex-wrap gap-x-10 gap-y-3 border-y border-zinc-800 py-4 lg:w-11/12">
              <div className="grid gap-0.5">
                <dt className="text-sm text-zinc-400">{t('details.duration')}</dt>
                <dd className="text-xl font-semibold text-white tabular-nums">{t(course.duration)}</dd>
              </div>
              <div className="grid gap-0.5">
                <dt className="text-sm text-zinc-400">{t('details.price')}</dt>
                <dd className="text-xl font-semibold text-white tabular-nums">{t('fee', { price: course.price })}</dd>
              </div>
            </dl>
            <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" data-gtm-course={course.tracking} target="_blank" rel="noopener noreferrer">
              {t('cta')}
            </CtaLink>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 lg:col-span-6">
            <Image
              src={course.image}
              alt={course.image === '/images/piercingPage/piercing.webp' ? t('details.piercing.fallbackAlt') : t(`${detail}.imageAlt`)}
              fill
              sizes="(min-width: 1536px) 696px, (min-width: 1024px) 50vw, 100vw"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export async function CourseOverview({ course, locale }: CourseSectionProps) {
  const t = await getTranslations({ locale, namespace: 'coursesPage' })
  const facts = [
    { title: t('details.format'), text: t(course.schedule) },
    { title: t('details.included'), text: t(course.supplies) },
    { title: t('details.diploma'), text: t('certificateSection.certificates.description') }
  ]

  return (
    <section aria-labelledby="course-overview-title" className="container">
      <div className="grid gap-6 border-t border-zinc-800 py-10 sm:py-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="grid content-start gap-4 lg:col-span-4">
          <h2 id="course-overview-title" className={headingClass}>{t('details.overview')}</h2>
          <p className="leading-relaxed text-zinc-300">{t(`details.${course.key}.audience`)}</p>
        </div>
        <dl className="divide-y divide-zinc-700 rounded-xl border border-zinc-800 bg-zinc-900 px-4 sm:px-6 lg:col-span-8">
          {facts.map(({ title, text }) => (
            <div key={title} className="grid gap-1 py-4 sm:grid-cols-3 sm:items-baseline sm:gap-4">
              <dt className="font-semibold text-white">{title}</dt>
              <dd className="leading-relaxed text-zinc-300 sm:col-span-2">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function CourseProgram({ title, items }: { title: string; items: ContentRow[] }) {
  return (
    <section aria-labelledby="course-program-title" className="container">
      <div className="grid gap-6 border-t border-zinc-800 py-10 sm:py-14 lg:grid-cols-12 lg:gap-x-10">
        <h2 id="course-program-title" className={headingClass}>{title}</h2>
        <ul className="divide-y divide-zinc-800 border-y border-zinc-800 lg:col-span-8">
          {items.map(({ title, text }) => (
            <li key={title} className="flex items-start gap-3 py-4 sm:py-5">
              <span aria-hidden="true" className="flex h-7 shrink-0 items-center"><span className="size-1.5 rounded-full bg-brand-red" /></span>
              <div className="grid gap-1.5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="leading-relaxed text-zinc-300">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function CourseStructuredData({ course, locale }: CourseSectionProps) {
  const t = await getTranslations({ locale, namespace: 'coursesPage' })
  const detail = `details.${course.key}` as const
  const structuredData = buildCoursePageJsonLd(locale, course, t(`${detail}.title`), t(`${detail}.lead`), t('details.catalog'), t(`${detail}.menu`))

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
  )
}
