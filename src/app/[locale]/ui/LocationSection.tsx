import { Clock, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_PHONE, CONTACT_TELEGRAM, LOCATION_GOOGLE_MAPS } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { LazyLocationMap } from './LazyLocationMap'

const textLinkClass =
  'inline-flex w-fit items-center gap-2 rounded-sm font-medium text-white hover:text-brand-red focus-visible:outline-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-colors'

export function LocationSection({ animate = false }: { animate?: boolean }) {
  const t = useTranslations('homePage.locationSection')
  const contact = useTranslations('homePage.contactsSection')
  const Content = animate ? FadeContent : 'div'

  const cards = [
    {
      Icon: MapPin,
      title: contact('location.title'),
      detail: contact('location.address'),
      description: contact('location.text')
    },
    {
      Icon: Clock,
      title: contact('workingHours.title'),
      detail: (
        <>
          {contact('workingHours.time')} <span className="whitespace-nowrap tabular-nums">10:00 - 20:30</span>
        </>
      ),
      description: t('appointment'),
      note: contact('workingHours.text')
    },
    {
      Icon: Phone,
      title: contact('contacts.title'),
      detail: (
        <a href={CONTACT_PHONE} data-gtm="phone" className={`${textLinkClass} min-h-6 tabular-nums`}>
          +373 79 146 506
        </a>
      ),
      description: contact('contacts.text'),
      action: (
        <CtaLink
          href={CONTACT_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          data-gtm="telegram"
          className="w-fit"
        >
          {contact('bookingCta')}
        </CtaLink>
      )
    }
  ]

  return (
    <section aria-labelledby="studio-directions-title" className="bg-zinc-900 pb-16 text-white lg:pb-20">
      <Content {...(animate ? { effect: 'focus', duration: 0.44, initialOpacity: 0.3 } as const : {})} className="container grid gap-6 lg:gap-8">
        <div className="grid gap-4 pb-2 lg:pb-4">
          <h2 id="studio-directions-title" className="scroll-mt-28 text-3xl/tight font-semibold tracking-tight text-pretty sm:text-4xl/tight lg:text-5xl/tight 2xl:text-6xl/tight">
            {animate ? <FoldText text={t('title')} /> : t('title')}
          </h2>
          <p className="leading-relaxed text-zinc-300 sm:text-lg/relaxed">{t('text')}</p>
        </div>

        <ul className="grid auto-rows-fr gap-4 md:grid-cols-3 lg:gap-6">
          {cards.map(({ Icon, title, detail, description, note, action }) => (
            <li key={title} className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-800 p-5 lg:p-7">
              <h3 className="flex items-center gap-3 text-lg/snug font-semibold lg:text-xl/snug">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-brand-red" />
                {animate ? <FoldText text={title} subtle /> : title}
              </h3>
              <div className="grid grow content-start gap-2">
                <div className="text-base/snug font-medium text-white">{detail}</div>
                <p className="text-sm/relaxed text-zinc-300">{description}</p>
                {note && <p className="text-sm/relaxed text-zinc-300">{note}</p>}
              </div>
              {action}
            </li>
          ))}
        </ul>

        <div className="grid gap-3">
          <LazyLocationMap openMapLabel={t('openMap')} />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
            <p className="leading-relaxed text-zinc-300">{t('description')}</p>
            <CtaLink href={LOCATION_GOOGLE_MAPS} data-gtm="google-maps" target="_blank" rel="noopener noreferrer">
              Google Maps
            </CtaLink>
          </div>
        </div>
      </Content>
    </section>
  )
}
