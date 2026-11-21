import { ArrowUpRight, Camera, Clock, MapPin, PenLine, Phone, Send } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import {
  CONTACT_FACEBOOK,
  CONTACT_INSTAGRAM,
  CONTACT_PHONE,
  CONTACT_TELEGRAM,
  CONTACT_VIBER,
  CONTACT_WHATSAPP,
  LOCATION_GOOGLE_MAPS
} from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { WavyBackground } from './WavyBackground'

const focusClass = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red'
const textLinkClass = `rounded-sm hover:text-brand-red motion-safe:transition-colors motion-safe:duration-150 ${focusClass}`

const benefits = [
  { key: 'location', Icon: MapPin },
  { key: 'schedule', Icon: Clock },
  { key: 'approach', Icon: PenLine }
] as const

const otherChannels = [
  { label: 'WhatsApp', href: CONTACT_WHATSAPP, tracking: 'whatsapp' },
  { label: 'Facebook', href: CONTACT_FACEBOOK, tracking: 'facebook' },
  { label: 'Viber', href: CONTACT_VIBER, tracking: 'viber', mobileOnly: true }
]

export async function ContactsHero() {
  const [locale, t, studio] = await Promise.all([
    getLocale(),
    getTranslations('contactsPage'),
    getTranslations('homePage.contactsSection')
  ])
  const channels = [
    { label: 'Telegram', value: `@${new URL(CONTACT_TELEGRAM).pathname.split('/')[1]}`, href: CONTACT_TELEGRAM, tracking: 'telegram', Icon: Send },
    { label: 'Instagram', value: `@${new URL(CONTACT_INSTAGRAM).pathname.split('/')[1]}`, href: CONTACT_INSTAGRAM, tracking: 'instagram', Icon: Camera },
    { label: t('panel.phone'), value: '+373 79 146 506', href: CONTACT_PHONE, tracking: 'phone', Icon: Phone }
  ]

  return (
    <section aria-labelledby="contacts-hero-title" className="relative isolate grid min-h-svh items-center overflow-hidden bg-zinc-950 pt-28 pb-16 text-white lg:pt-32 lg:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900">
        <div className="absolute inset-0 bg-radial-at-br from-rose-950/45 via-transparent to-transparent" />
        <WavyBackground />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/50 via-transparent via-70% to-zinc-900" />
      </div>

      <div className="container grid items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
        <FadeContent
          effect="focus"
          trigger="mount"
          duration={0.52}
          initialOpacity={0.8}
          className="grid min-w-0 gap-6 sm:gap-8 lg:col-span-7"
        >
          <div className="grid gap-4 sm:gap-6">
            <h1 id="contacts-hero-title" className="service-hero-title font-bold tracking-tight text-balance wrap-break-word">
              <FoldText text={t.markup('hero.title', { studio: (word) => word })} />
            </h1>
            <p className="text-base/relaxed text-zinc-300 sm:text-lg/relaxed">
              {t('hero.lead')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CtaLink
              href={CONTACT_TELEGRAM}
              data-gtm="telegram"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cta.appointment')}
            </CtaLink>
            <CtaLink
              href={getPathname({ locale, href: '/gallery' })}
              data-gtm="contact-view-portfolio"
            >
              {t('cta.portfolio')}
            </CtaLink>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-sm text-zinc-300">
            {benefits.map(({ key, Icon }) => (
              <li key={key} className="flex items-center gap-2">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
                {t(`benefits.${key}`)}
              </li>
            ))}
          </ul>
        </FadeContent>

        <section aria-labelledby="contacts-hero-panel-title" className="min-w-0 lg:col-span-5">
          <FadeContent
            effect="focus"
            duration={0.44}
            initialOpacity={0.3}
            className="grid gap-5 rounded-xl border border-white/15 bg-zinc-900/80 p-5 sm:p-7"
          >
            <div className="grid gap-2">
              <h2 id="contacts-hero-panel-title" className="text-2xl/tight font-semibold tracking-tight sm:text-3xl/tight">
                <FoldText text={t('panel.title')} />
              </h2>
              <p className="text-sm/relaxed text-zinc-300">{t('panel.consultation')}</p>
            </div>

            <dl className="grid gap-4 border-t border-white/15 pt-5 sm:max-lg:grid-cols-2 xl:grid-cols-2">
              <div className="grid content-start gap-1">
                <dt className="text-xs/5 font-medium tracking-wide text-zinc-400 uppercase">{studio('location.title')}</dt>
                <dd className="font-medium">{t('panel.address')}</dd>
                <dd>
                  <a
                    href={LOCATION_GOOGLE_MAPS}
                    data-gtm="google-maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-zinc-300 ${textLinkClass}`}
                  >
                    {t('cta.directions')}
                    <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 text-brand-red" />
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-1">
                <dt className="text-xs/5 font-medium tracking-wide text-zinc-400 uppercase">{studio('workingHours.title')}</dt>
                <dd className="font-medium">
                  {studio('workingHours.time')} <span className="whitespace-nowrap tabular-nums">10:00–20:30</span>
                </dd>
                <dd className="text-sm/relaxed text-zinc-400">{t('panel.byAppointment')}</dd>
              </div>
            </dl>

            <ul className="divide-y divide-white/10 border-y border-white/15">
              {channels.map(({ label, value, href, tracking, Icon }) => (
                <li key={tracking}>
                  <a
                    href={href}
                    data-gtm={tracking}
                    target={tracking === 'phone' ? undefined : '_blank'}
                    rel={tracking === 'phone' ? undefined : 'noopener noreferrer'}
                    className={`group flex min-h-12 items-center gap-2 rounded-sm py-2 text-sm ${focusClass}`}
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
                    <span className="grow font-medium">{label}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-zinc-400 tabular-nums group-focus-visible:text-white">
                      <span className="group-hover:text-brand-red motion-safe:transition-colors motion-safe:duration-150">
                        {value}
                      </span>
                      <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <ul className="flex flex-wrap gap-x-5 text-sm text-zinc-400">
              {otherChannels.map(({ label, href, tracking, mobileOnly }) => (
                <li key={tracking} className={mobileOnly ? 'md:hidden' : undefined}>
                  <a
                    href={href}
                    data-gtm={tracking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-11 items-center gap-1.5 ${textLinkClass}`}
                  >
                    {label}
                    <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </FadeContent>
        </section>
      </div>
    </section>
  )
}
