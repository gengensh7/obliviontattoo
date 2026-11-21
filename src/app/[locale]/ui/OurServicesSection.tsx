import { ArrowUpRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import { SUPABASE_S3_URL } from '@/lib/config'
import { cn } from '@/lib/utils'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

const detailSizes = '(min-width: 1536px) 367px, (min-width: 1280px) 303px, (min-width: 1024px) 239px, (min-width: 768px) 362px, (min-width: 640px) 298px, calc(100vw - 32px)'

type ServicePhoto = {
  src: string
  sizes: string
  frame: string
  layout?: string
}

const services = {
  '/tattoo': {
    src: `${SUPABASE_S3_URL}/Portfolio/IMG_20250914_133848.webp`,
    sizes: '(min-width: 1536px) 746px, (min-width: 1280px) 618px, (min-width: 1024px) 490px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 32px)',
    layout: 'sm:col-span-2 lg:row-span-2',
    frame: 'aspect-4/5 sm:aspect-3/2 lg:aspect-auto lg:min-h-128 lg:flex-1 xl:min-h-144 2xl:min-h-160'
  },
  '/piercing': {
    src: `${SUPABASE_S3_URL}/Piercing/piercing-1.webp`,
    sizes: detailSizes,
    frame: 'aspect-2/1'
  },
  '/permanent': {
    src: '/images/permanentPage/permanent-brovi-kishinev.webp',
    sizes: detailSizes,
    frame: 'aspect-2/1'
  },
  '/course': {
    src: '/images/coursePage/course-1.webp',
    sizes: '(min-width: 1536px) 311px, (min-width: 1280px) 258px, (min-width: 1024px) 205px, (min-width: 768px) 307px, (min-width: 640px) 253px, calc(100vw - 32px)',
    layout: 'sm:col-span-2',
    frame: 'aspect-square sm:w-5/12 sm:shrink-0'
  }
} satisfies Record<string, ServicePhoto>

export const OurServicesSection = async () => {
  const [t, locale] = await Promise.all([getTranslations('homePage.ourServicesSection'), getLocale()])

  const cards = t.raw('cards') as {
    title: string
    description: string
    href: keyof typeof services
  }[]

  return (
    <section aria-labelledby="home-services-title" className="bg-zinc-50 text-zinc-950">
      <div className="container flex flex-col gap-10 py-14 md:gap-12 lg:py-20">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="grid items-start gap-5 md:grid-cols-2 lg:gap-12">
          <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl">
            <FoldText text={t('mainTitle')} />
          </h1>
          <div className="flex flex-col items-start gap-4">
            <p className="leading-relaxed text-zinc-700">{t('description')}</p>
            <CtaLink
              href={getPathname({ locale, href: '/gallery' })}
              data-gtm="portfolio-view-gallery"
            >
              {t('galleryLink')}
            </CtaLink>
          </div>
        </FadeContent>

        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="flex flex-col gap-5 md:gap-6">
          <h2 id="home-services-title" className="text-2xl leading-tight font-bold tracking-tight md:text-3xl">
            <FoldText text={t('title')} />
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const service: ServicePhoto = services[card.href]
              const isCourse = card.href === '/course'

              return (
                <li key={card.href} className={cn('min-w-0', service.layout)}>
                  <Link
                    href={getPathname({ locale, href: card.href })}
                    data-gtm="service-navigation"
                    data-gtm-destination={card.href}
                    className={cn(
                      'group flex h-full min-w-0 flex-col bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600',
                      isCourse && 'sm:flex-row'
                    )}
                  >
                    <div className={cn('relative overflow-hidden bg-zinc-200', service.frame)}>
                      <Image
                        src={service.src}
                        alt=""
                        fill
                        sizes={service.sizes}
                        className="object-cover object-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-103"
                      />
                    </div>
                    <div className={cn('flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5 lg:p-4 xl:p-5', isCourse && 'sm:justify-center')}>
                      <div className="flex items-start justify-between gap-2 group-hover:text-red-600 group-focus-visible:text-red-600 motion-safe:transition-colors">
                        <h3 className={cn('text-xl leading-tight font-bold wrap-break-word', (isCourse || card.href === '/tattoo') && 'lg:text-2xl')}>
                          <FoldText text={card.title} subtle />
                        </h3>
                        <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-700 group-hover:text-red-600 group-focus-visible:text-red-600 motion-safe:transition-colors">{card.description}</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </FadeContent>
      </div>
    </section>
  )
}
