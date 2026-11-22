import Image from 'next/image'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import type { CSSProperties } from 'react'
import { Link } from '@/i18n/navigation'
import { CONTACT_INSTAGRAM, CONTACT_TELEGRAM, CONTACT_VIBER, CONTACT_WHATSAPP } from '@/lib/contactLinks'
import { getCurrentYear } from '@/lib/getCurrentYear'
import { CookieConsentGate } from '@/widgets/cookie-modal/cookie-consent-gate'

const destinations = ['/', '/tattoo', '/piercing', '/permanent', '/course', '/gallery', '/blog', '/contacts']
const socialLinks = [
  { name: 'Instagram', href: CONTACT_INSTAGRAM },
  { name: 'Telegram', href: CONTACT_TELEGRAM },
  { name: 'WhatsApp', href: CONTACT_WHATSAPP },
  { name: 'Viber', href: CONTACT_VIBER }
]
const linkStyle = 'rounded-sm text-zinc-400 no-underline hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red motion-safe:transition-colors'

export default async function FooterMenu() {
  const [year, t] = await Promise.all([getCurrentYear(), getTranslations('homePage')])
  const headerLinks = t.raw('header.links') as { label: string; href: string }[]
  const labels = Object.fromEntries(headerLinks.map(({ href, label }) => [href, label]))
  labels['/'] = t('headerMobile.home')

  return (
    <footer className="bg-zinc-900 text-sm text-zinc-400">
      <div className="container">
        <NextIntlClientProvider messages={null}>
          <div className="flex flex-col items-center gap-5 pt-8 pb-6 sm:gap-6 sm:pt-10">
            <Link href="/" aria-label={`Oblivion Tattoo — ${labels['/']}`} className={linkStyle}>
              <Image src="/logo.svg" alt="" width={68} height={96} className="h-24 w-auto" />
            </Link>
            <nav aria-label={t('headerMobile.navigation')}>
              <ul className="text-center text-balance sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-7 sm:gap-y-1">
                {destinations.map((href) => (
                  <li key={href} className="inline-block px-2 sm:px-0">
                    <Link href={href} className={`inline-flex min-h-8 items-center ${linkStyle}`}>
                      {labels[href]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </NextIntlClientProvider>

        <div className="flex flex-col items-center gap-2 border-t border-zinc-800 py-4 md:flex-row md:justify-between md:gap-6 md:pr-16">
          <div className="flex flex-col items-center gap-x-6 gap-y-1 md:flex-row md:flex-wrap">
            <p className="text-zinc-300">© {year} Oblivion Tattoo</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href="/terms-en.pdf" data-gtm="terms-download" className={`inline-flex min-h-8 items-center ${linkStyle}`}>
                {t('footer.terms')}
              </a>
              <Suspense fallback={null}>
                <CookieConsentGate />
              </Suspense>
            </div>
          </div>
          <ul className="flex shrink-0 items-center">
            {socialLinks.map(({ name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  aria-label={name}
                  data-gtm={name.toLowerCase()}
                  target={name === 'Viber' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`group grid size-11 place-items-center opacity-75 hover:opacity-100 focus-visible:opacity-100 ${linkStyle}`}
                >
                  <span
                    aria-hidden="true"
                    className="size-4.5 mask-(--social-icon) mask-contain mask-no-repeat bg-zinc-200 group-hover:bg-brand-red motion-safe:transition-colors"
                    style={{ '--social-icon': `url(/icons/social/${name.toLowerCase()}.svg)` } as CSSProperties}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
