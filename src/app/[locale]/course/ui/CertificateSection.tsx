import { Maximize2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import Lightbox from '@/shared/Lightbox'

const photos = [
  { src: '/images/coursePage/course-1.webp', width: 1600, height: 2131, altKey: 'alt1' },
  { src: '/images/coursePage/course-2.webp', width: 960, height: 1280, altKey: 'alt2' }
] as const

export const CertificateSection = async () => {
  const [t, viewer] = await Promise.all([
    getTranslations('coursesPage.certificateSection.certificates'),
    getTranslations('homePage.portfolioSection')
  ])

  return (
    <section aria-labelledby="course-diploma-title" className="bg-zinc-900 py-12 text-white sm:py-16 lg:py-18">
      <div className="container grid items-center gap-8 lg:grid-cols-5 lg:gap-10 xl:gap-14">
        <div className="flex min-w-0 flex-col items-start gap-6 lg:col-span-2">
          <div className="flex flex-col gap-4">
            <h2 id="course-diploma-title" className="text-2xl leading-tight font-semibold text-balance sm:text-3xl lg:text-4xl 2xl:text-5xl">
              {t('title')}
            </h2>
            <p className="text-base text-pretty text-zinc-300 sm:text-lg">{t('description')}</p>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-white/10 pt-4">
            <p className="text-base font-medium text-pretty text-zinc-100">{t('languages')}</p>
            <p className="text-sm text-pretty text-zinc-400">{t('otherLanguage')}</p>
          </div>
        </div>

        <Lightbox
          gallery="course-diploma-gallery"
          labels={{
            close: viewer('close'),
            previous: viewer('previous'),
            next: viewer('next'),
            zoom: viewer('zoom'),
            error: viewer('error')
          }}
        >
          <div id="course-diploma-gallery" className="grid min-w-0 items-start gap-4 sm:grid-cols-2 lg:col-span-3 xl:gap-5">
            {photos.map(({ src, width, height, altKey }, index) => {
              const alt = t(`images.${altKey}`)

              return (
                <CardContainer
                  key={src}
                  className="w-full"
                  containerClassName={index === 1 ? 'course-diploma-card py-0 sm:pt-8 xl:pt-12' : 'course-diploma-card py-0'}
                >
                  <CardBody className="course-diploma-card-body h-auto w-full rounded-xl bg-zinc-800 p-1.5 shadow-lg shadow-black/30">
                    <CardItem
                      as="a"
                      href={src}
                      aria-label={t('images.open', { index: index + 1, alt })}
                      aria-haspopup="dialog"
                      data-pswp-width={width}
                      data-pswp-height={height}
                      translateZ={10}
                      className="group relative block w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                    >
                      <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        sizes="(min-width: 1536px) 418px, (min-width: 1280px) 342px, (min-width: 1024px) 270px, (min-width: 768px) 348px, (min-width: 640px) 284px, calc(100vw - 44px)"
                        className="h-auto w-full rounded-lg"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-zinc-950/80 text-white group-hover:bg-zinc-950 group-focus-visible:bg-zinc-950"
                      >
                        <Maximize2 className="size-4" />
                      </span>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              )
            })}
          </div>
        </Lightbox>
      </div>
    </section>
  )
}
