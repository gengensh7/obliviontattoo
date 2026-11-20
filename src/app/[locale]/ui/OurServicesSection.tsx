import { SquareArrowOutUpRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'
import { FramerMotionContainer } from '@/shared/FramerMotionContainer'

const cardsImages = [
  '/images/homePage/services-section/ikonka-tatu-mashinka.webp',
  '/images/homePage/services-section/ikonka-pirsing.webp',
  '/images/homePage/services-section/ikonka-permanent-tatu.webp',
  '/images/homePage/services-section/ikonka-eskiz-tatu.webp'
]

export const OurServicesSection = async () => {
  const t = await getTranslations('homePage.ourServicesSection')
  const locale = await getLocale()

  const cardsArray = t.raw('cards') as {
    title: string
    description: string
    href: string
  }[]

  return (
    <section>
      <div className="container flex flex-col gap-20 py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h1 className="text-3xl md:text-5xl">{t('mainTitle')}</h1>
          <p>{t('description')}</p>
          <Link href={getPathname({ locale, href: '/gallery' })} data-gtm="portfolio-view-gallery" className="font-bold underline underline-offset-4 hover:text-red-700">
            {t('galleryLink')}
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          <h2 className="text-center text-2xl md:text-3xl">{t('title')}</h2>
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 xl:grid-cols-4">
            {cardsArray.map((card, i) => (
              <FramerMotionContainer key={card.href}>
                <Link href={getPathname({ locale, href: card.href })} data-gtm="service-navigation" data-gtm-destination={card.href} className="group relative h-full -mb-px -ml-px flex flex-col items-center gap-4 border border-gray-200 p-6 text-center">
                  <Image
                    src={cardsImages[i]}
                    width={80}
                    height={80}
                    alt=""
                    className="h-18 w-18 duration-300 group-hover:-translate-y-1 group-hover:rotate-15"
                  />
                  <h3 className="text-lg font-bold underline decoration-gray-400 underline-offset-4 group-hover:text-red-700">{card.title}</h3>
                  <p className="min-h-10">{card.description}</p>
                  <SquareArrowOutUpRight className="absolute top-4 right-4 size-4" />
                </Link>
              </FramerMotionContainer>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
