import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { MagicBento } from '@/components/ui/magic-bento'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

const colourOptions = ['monochrome', 'colour'] as const
const rates = [
  { size: 'small', monochrome: '400–1300', colour: '500–1500' },
  { size: 'medium', monochrome: '900–3500', colour: '1000–4000' }
] as const

function ServicePrice({ title, price, description }: { title: string; price: string; description: string }) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <h3 className="text-base font-semibold text-zinc-100"><FoldText text={title} subtle /></h3>
      <p className="text-2xl leading-none font-semibold text-white tabular-nums sm:text-3xl">{price}</p>
      <p className="text-sm/6 text-zinc-400">{description}</p>
    </div>
  )
}

export const ServicesSection = async () => {
  const t = await getTranslations('tattooPage.servicesSection')

  return (
    <section aria-labelledby="tattoo-prices-title" className="bg-zinc-950 text-white">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col gap-7 py-16 sm:gap-9 sm:py-20">
        <div className="flex flex-col gap-4">
          <h2
            id="tattoo-prices-title"
            className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl xl:text-5xl"
          >
            <FoldText text={t('title')} />
          </h2>
          <p className="text-base/7 text-zinc-400">{t('description')}</p>
        </div>

        <MagicBento
          className="gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12"
          enableBorderGlow
          enableSpotlight
          glowColor="178, 61, 66"
          spotlightRadius={320}
          intro={false}
          items={[
            {
              id: 'tattoo-rates',
              className: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
              surfaceClassName: 'bg-zinc-900',
              content: (
                <div className="flex flex-1 px-4 sm:px-6 md:py-3 lg:px-7">
                  <table
                    role="table"
                    aria-labelledby="tattoo-prices-title"
                    className="block w-full table-fixed text-left md:table"
                  >
                    <thead
                      role="rowgroup"
                      className="sr-only border-b border-white/10 text-zinc-300 md:not-sr-only md:table-header-group"
                    >
                      <tr role="row">
                        <th scope="col" className="w-1/5 py-4 font-medium">
                          {t('comparison.size')}
                        </th>
                        {colourOptions.map(option => (
                          <th key={option} scope="col" className="py-4 pl-4 font-medium">
                            {t(`comparison.${option}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody role="rowgroup" className="block divide-y divide-white/10 md:table-row-group">
                      {rates.map(rate => (
                        <tr
                          key={rate.size}
                          role="row"
                          className="grid grid-cols-2 gap-x-2 gap-y-3 py-5 sm:gap-x-6 sm:py-6 md:table-row"
                        >
                          <th
                            role="rowheader"
                            scope="row"
                            className="col-span-2 font-semibold text-zinc-100 tabular-nums sm:text-lg md:table-cell md:py-5 md:font-medium md:text-zinc-300"
                          >
                            {t(`comparison.${rate.size}`)}
                          </th>
                          {colourOptions.map(option => (
                            <td key={option} role="cell" className="min-w-0 md:table-cell md:py-5 md:pl-4">
                              <span aria-hidden="true" className="block pb-2 text-sm font-medium text-zinc-400 md:hidden">
                                {t(`comparison.${option}`)}
                              </span>
                              <div className="flex flex-col gap-1.5 sm:max-md:flex-row sm:max-md:items-baseline">
                                <span className="whitespace-nowrap text-2xl leading-none font-semibold tracking-tight tabular-nums sm:text-3xl xl:text-4xl 2xl:text-5xl">
                                  {rate[option]}
                                </span>
                                <span className="text-xs text-zinc-400 sm:text-sm">{t('currency')}</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            },
            {
              id: 'cover-up',
              className: 'lg:col-span-5',
              content: (
                <ServicePrice
                  title={t('coverUp.title')}
                  price={t('coverUp.price')}
                  description={t('coverUp.description')}
                />
              )
            },
            {
              id: 'deposit',
              className: 'lg:col-span-5',
              content: (
                <ServicePrice
                  title={t('deposit.title')}
                  price={t('deposit.price')}
                  description={t('deposit.description')}
                />
              )
            },
            {
              id: 'sketches',
              className: 'md:col-span-2 lg:col-span-12',
              content: (
                <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-12 md:gap-6">
                  <div className="flex flex-col gap-2 md:col-span-3">
                    <h3 className="text-base font-semibold text-zinc-100"><FoldText text={t('sketches.title')} subtle /></h3>
                    <p className="text-2xl leading-none font-semibold text-white sm:text-3xl">{t('sketches.price')}</p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-white/10 pt-4 md:col-span-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                    <h4 className="text-sm font-semibold text-zinc-100"><FoldText text={t('sketches.custom.title')} subtle /></h4>
                    <p className="text-sm/6 text-zinc-400">{t('sketches.custom.description')}</p>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-white/10 pt-4 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                    <h4 className="text-sm font-semibold text-zinc-100"><FoldText text={t('sketches.coverUp.title')} subtle /></h4>
                    <p className="text-sm/6 text-zinc-400">{t('sketches.coverUp.description')}</p>
                  </div>
                </div>
              )
            }
          ]}
        />

        <div className="flex sm:justify-end">
          <CtaLink
            href={CONTACT_TELEGRAM}
            data-gtm="telegram"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            {t('cta')}
          </CtaLink>
        </div>
      </FadeContent>
    </section>
  )
}
