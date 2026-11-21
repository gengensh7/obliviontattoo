import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { cn } from '@/lib/utils'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { groupPiercingPrices, type PriceCategory } from '../piercing-prices'
import { PricingTabs } from './PricingTabs'

export async function PricingSection() {
  const t = await getTranslations('piercingPage.pricingSection')
  const groups = groupPiercingPrices(t.raw('categories') as PriceCategory[])
  const currency = t('labels.currency')
  const book = t('buttons.book')
  const tabs = groups.map(({ group, services }) => ({
    title: t(`tabs.${group}`),
    value: group,
    preview: services[0] && (
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="shrink-0 font-semibold text-white">{t(`tabs.${group}`)}</span>
        <span className="truncate text-zinc-300">{services[0].name}</span>
      </div>
    ),
    content: (
      <ul
        role="list"
        className={cn(
          'grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800',
          services.length > 6 && 'lg:grid-cols-2'
        )}
      >
        {services.map(({ name, price, hasBase }) => (
          <li
            key={name}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-3 bg-zinc-900 px-4 py-3.5 sm:px-6 md:flex-nowrap md:items-center md:gap-x-5 md:py-2"
          >
            <div className="grid min-w-0 flex-1 gap-1">
              <span className="wrap-break-word leading-snug font-medium text-zinc-100 sm:text-lg">{name}</span>
              {hasBase && <p className="text-sm text-zinc-400">{t('labels.includesBaseJewelry')}</p>}
            </div>
            <div className="contents md:flex md:shrink-0 md:items-center md:gap-4">
              <span className="shrink-0 text-lg font-bold whitespace-nowrap text-white tabular-nums sm:text-xl">
                {price} <span className="text-sm font-normal text-zinc-400">{currency}</span>
              </span>
              <div className="flex w-full md:w-auto">
                <CtaLink
                  href={CONTACT_TELEGRAM}
                  data-gtm="telegram"
                  data-gtm-service={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('buttons.bookService', { service: name.trim() })}
                  className="px-4 whitespace-nowrap md:px-3"
                >
                  {book}
                </CtaLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }))

  return (
    <section
      id="pricing"
      aria-labelledby="piercing-pricing-title"
      tabIndex={-1}
      className="scroll-mt-24 border-t border-zinc-800 bg-zinc-950 py-12 text-white sm:py-16 lg:py-20"
    >
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container grid gap-7 sm:gap-9">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
          <h2 id="piercing-pricing-title" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            <FoldText text={t('title')} />
          </h2>
          <p className="text-base/relaxed text-zinc-300 sm:text-lg/relaxed">{t('description')}</p>
        </div>
        <div className="grid gap-4">
          <PricingTabs tabs={tabs} labelledBy="piercing-pricing-title" />
        </div>
      </FadeContent>
    </section>
  )
}
