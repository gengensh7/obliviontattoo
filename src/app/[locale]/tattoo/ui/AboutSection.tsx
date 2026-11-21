import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

const stepKeys = ['idea', 'consultation', 'booking'] as const

export const AboutSection = async () => {
  const t = await getTranslations('tattooPage.aboutSection')
  const steps = stepKeys.map((step) => {
    const title = t(`panels.${step}.title`)
    const items = t.raw(`panels.${step}.items`) as string[]

    return {
      title: t(`steps.${step}.title`),
      description: t(`steps.${step}.description`),
      panelTitle: title,
      content: (
        <div key={step} className="flex flex-1 flex-col gap-3">
          <p className="text-base/relaxed text-zinc-300">
            {t.rich(`panels.${step}.intro`, {
              amount: (value) => <strong className="font-semibold text-brand-red">{value}</strong>
            })}
          </p>
          <ul className="flex flex-1 flex-col divide-y divide-white/10 border-y border-white/10">
            {items.map((item) => (
              <li key={item} className="flex flex-1 items-center gap-3 py-2 text-base/relaxed text-white">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand-red" />
                {item}
              </li>
            ))}
          </ul>
          {step === 'booking' && <p className="text-sm/relaxed text-zinc-300">{t('panels.booking.note')}</p>}
        </div>
      ),
      inlineContent: step === 'idea' && (
        <div className="flex flex-col gap-3">
          <p className="montserrat text-base font-semibold text-white">{title}</p>
          <ul className="flex list-disc flex-col gap-2 pl-4 text-sm/relaxed text-zinc-300 marker:text-brand-red">
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )
    }
  })

  return (
    <section aria-labelledby="tattoo-consultation-title" className="bg-zinc-950 text-white">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col items-start gap-8 pt-16 lg:gap-12 lg:pt-24">
        <h2 id="tattoo-consultation-title" className="text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
          <FoldText text={t('title')} />
        </h2>

        <StickyScroll steps={steps}>
          <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" target="_blank" rel="noopener noreferrer">
            {t('telegram')}
          </CtaLink>
        </StickyScroll>
      </FadeContent>
    </section>
  )
}
