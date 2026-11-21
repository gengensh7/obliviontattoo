import { ArrowUpRight, Info, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_FACEBOOK, CONTACT_INSTAGRAM, CONTACT_PHONE, CONTACT_TELEGRAM, CONTACT_VIBER, CONTACT_WHATSAPP } from '@/lib/contactLinks'

type StudioLink = { label: string; href: string }

const socialLinks = [
  { label: 'Instagram', href: CONTACT_INSTAGRAM, tracking: 'instagram' },
  { label: 'Facebook', href: CONTACT_FACEBOOK, tracking: 'facebook' },
  { label: 'Telegram', href: CONTACT_TELEGRAM, tracking: 'telegram' },
  { label: 'WhatsApp', href: CONTACT_WHATSAPP, tracking: 'whatsapp' },
  { label: 'Viber', href: CONTACT_VIBER, tracking: 'viber', mobileOnly: true }
]

export const ContactsSection = ({
  title,
  text,
  studioLinks,
  showNightSessions = true
}: { title?: ReactNode; text?: ReactNode; studioLinks?: { contacts: StudioLink; home: StudioLink }; showNightSessions?: boolean } = {}) => {
  const t = useTranslations('homePage.contactsSection')

  return (
    <section aria-labelledby="studio-contact-title" className="bg-zinc-900 pb-16 text-white lg:pb-20">
      <div className="container grid gap-8 lg:gap-10">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="grid min-w-0 justify-items-start gap-6 lg:gap-8">
            <div className="grid gap-4">
              <h2 id="studio-contact-title" className="text-3xl/tight font-semibold tracking-tight text-pretty wrap-break-word sm:text-4xl/tight md:text-5xl/tight 2xl:text-6xl/tight">
                {title ?? t('title')}
              </h2>
              <p className="max-w-xl leading-relaxed text-zinc-300 sm:text-lg/relaxed">{text ?? t('text')}</p>
            </div>
            <div className="grid min-w-0 justify-items-start gap-2">
              <CtaLink
                href={CONTACT_TELEGRAM}
                data-gtm="telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('bookingCta')}
              </CtaLink>
              {studioLinks && (
                <ul className="flex max-w-full flex-wrap items-center gap-x-6">
                  {[
                    { ...studioLinks.contacts, Icon: MapPin },
                    { ...studioLinks.home, Icon: Info }
                  ].map(({ label, href, Icon }) => (
                    <li key={href} className="min-w-0">
                      <Link
                        href={href}
                        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-zinc-400 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 motion-safe:transition-colors motion-safe:duration-150"
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0" />
                        <span className="wrap-break-word">{label}</span>
                        <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <dl className="min-w-0 divide-y divide-zinc-700 border-t border-zinc-700">
            <div className="grid items-baseline gap-x-4 py-3 sm:grid-cols-4">
              <dt className="text-xs font-medium tracking-wider text-zinc-400 uppercase">{t('contacts.title')}</dt>
              <dd className="min-w-0 sm:col-span-3">
                <a
                  href={CONTACT_PHONE}
                  data-gtm="phone"
                  className="inline-flex min-h-11 items-center rounded-sm text-2xl font-semibold tabular-nums hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 motion-safe:transition-colors motion-safe:duration-150"
                >
                  +373 79 146 506
                </a>
                <p className="text-sm/relaxed text-zinc-400">{t('contacts.text')}</p>
              </dd>
            </div>

            <div className="grid items-baseline gap-x-4 gap-y-2 py-4 sm:grid-cols-4">
              <dt className="text-xs font-medium tracking-wider text-zinc-400 uppercase">{t('location.title')}</dt>
              <dd className="grid min-w-0 gap-1 sm:col-span-3">
                <p className="text-lg/snug font-medium">{t('location.address')}</p>
                <p className="text-sm/relaxed text-zinc-400">{t('location.text')}</p>
              </dd>
            </div>

            <div className="grid items-baseline gap-x-4 gap-y-2 py-4 sm:grid-cols-4">
              <dt className="text-xs font-medium tracking-wider text-zinc-400 uppercase">{t('workingHours.title')}</dt>
              <dd className="grid min-w-0 gap-1 sm:col-span-3">
                <p className="text-lg/snug font-medium tabular-nums">{t('workingHours.time')} 10:00 - 20:30</p>
                {showNightSessions && <p className="text-sm/relaxed text-zinc-400">{t('workingHours.text')}</p>}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-2 border-t border-zinc-700 pt-4 lg:flex lg:items-center lg:justify-between lg:gap-6">
          <p className="text-sm font-medium text-zinc-300">{t('social')}</p>
          <ul className="grid grid-cols-2 gap-x-4 sm:flex sm:flex-wrap sm:gap-x-8">
            {socialLinks.map(({ label, href, tracking, mobileOnly }) => (
              <li key={label} className={mobileOnly ? 'md:hidden' : undefined}>
                <a
                  href={href}
                  data-gtm={tracking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-center gap-2 rounded-sm font-medium text-zinc-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 motion-safe:transition-colors motion-safe:duration-150"
                >
                  {label}
                  <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-zinc-400 group-hover:text-red-400 motion-safe:transition-colors motion-safe:duration-150" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
