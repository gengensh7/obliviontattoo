import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { Timeline, type TimelineEntry } from '@/components/ui/timeline'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { groupPiercingPrices, type PriceCategory } from '../piercing-prices'

const stepCopy = 'text-base/relaxed text-zinc-300 lg:text-lg/relaxed'

export async function PiercingTimelineSection() {
  const t = await getTranslations('piercingPage')
  const groups = groupPiercingPrices(t.raw('pricingSection.categories') as PriceCategory[])
  const currency = t('pricingSection.labels.currency')

  const data: TimelineEntry[] = [
    {
      title: t('timeline.catalog.title'),
      content: (
        <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/55 px-4 sm:px-6 lg:px-8">
          {groups.map(({ group, services }) => (
            <div key={group} className="grid gap-4 py-5 sm:py-6">
              <div className="grid gap-2">
                <h4 className="text-lg font-bold sm:text-xl">
                  <FoldText text={t(`timeline.catalog.${group}.category`)} subtle />
                </h4>
                <p className="text-sm/relaxed text-zinc-300 sm:text-base/relaxed">{t(`timeline.catalog.${group}.description`)}</p>
              </div>
              <ul role="list" className="grid gap-x-6 gap-y-1 xl:grid-cols-2">
                {services.map(({ name, price }) => (
                  <li key={name} className="flex items-baseline justify-between gap-2 border-b border-white/10 py-1.5 text-sm">
                    <span className="min-w-0 wrap-break-word text-zinc-200">{name}</span>
                    <span className="shrink-0 font-bold whitespace-nowrap text-white tabular-nums">
                      {price} <span className="text-xs font-normal text-zinc-400">{currency}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t('timeline.selection.title'),
      content: (
        <div className="grid gap-5 border-t border-zinc-800 pt-4 lg:grid-cols-2 lg:gap-8">
          {(['placement', 'jewelry'] as const).map((item) => (
            <div key={item} className="grid content-start gap-2">
              <h4 className="text-base font-bold sm:text-lg">
                <FoldText text={t(`timeline.selection.${item}.title`)} subtle />
              </h4>
              <p className={stepCopy}>{t(`timeline.selection.${item}.text`)}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t('timeline.booking.title'),
      content: (
        <div className="grid justify-items-start gap-4 border-t border-zinc-800 pt-4">
          <p className={stepCopy}>{t('timeline.booking.text')}</p>
          <CtaLink href="#pricing">{t('timeline.booking.prices')}</CtaLink>
        </div>
      )
    },
    {
      title: t('timeline.preparation.title'),
      content: (
        <div className="grid gap-5 border-t border-zinc-800 pt-4 lg:grid-cols-2 lg:gap-8">
          {(['consultation', 'sterility'] as const).map((item) => (
            <div key={item} className="grid content-start gap-2">
              <h4 className="text-base font-bold sm:text-lg">
                <FoldText text={t(`timeline.preparation.${item}.title`)} subtle />
              </h4>
              <p className={stepCopy}>{t(`timeline.preparation.${item}.description`)}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t('timeline.procedure.title'),
      content: <p className={`border-t border-zinc-800 pt-4 ${stepCopy}`}>{t('timeline.procedure.description')}</p>
    },
    {
      title: t('timeline.aftercare.title'),
      content: (
        <div className="grid justify-items-start gap-4 border-t border-zinc-800 pt-4">
          <p className={stepCopy}>{t('timeline.aftercare.description')}</p>
          <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" target="_blank" rel="noopener noreferrer">
            {t('timeline.aftercare.book')}
          </CtaLink>
        </div>
      )
    }
  ]

  return (
    <section aria-labelledby="piercing-timeline-title" className="border-t border-zinc-800 bg-zinc-950 py-12 text-white sm:py-16 lg:py-20">
      <div className="container grid gap-8 sm:gap-12 lg:gap-16">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
          <h2 id="piercing-timeline-title" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            <FoldText text={t('timeline.title')} />
          </h2>
        </FadeContent>
        <Timeline data={data} />
      </div>
    </section>
  )
}
