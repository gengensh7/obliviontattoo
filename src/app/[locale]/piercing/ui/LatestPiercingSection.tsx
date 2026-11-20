import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'
import Lightbox from '@/shared/Lightbox'
import { LatestPiercingCard } from './LatestPiercingCard'

export const LatestPiercingSection = async () => {
  const locale = await getLocale()
  const t = await getTranslations('piercingPage.latestPiercingSection')

  const alts = t.raw('imageAlts') as string[]

  return (
    <section className="bg-zinc-900">
      <div className="container flex flex-col gap-12 pb-20">
        <div
          className="flex flex-col items-center gap-4 text-center"
        >
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">{t('title')}</h2>
          <p className="mx-auto max-w-4xl text-center text-white">{t('description')}</p>
        </div>

        <Lightbox gallery="piercing-portfolio">
          <div id="piercing-portfolio" className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {alts.map((alt, i) => (
              <div
                key={i}
                className="flex flex-col gap-12"
              >
                <LatestPiercingCard src={`/images/piercingPage/piercing-price-${i + 1}.webp`} alt={alt} />
              </div>
            ))}
          </div>
        </Lightbox>
        <Link
          href={getPathname({ locale, href: '/contacts' })}
          data-gtm="piercing-contacts"
          className="mx-auto w-fit rounded-md bg-white px-6 py-4 font-bold text-black transition-colors duration-200 hover:text-red-500"
        >
          {t('contactsLink')}
        </Link>
      </div>
    </section>
  )
}
