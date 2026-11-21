import { hasLocale } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { type AppLocale, routing } from '@/i18n/routing'
import { getSketchImages } from '@/lib/cachedPrisma'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { LazySketchesCarousel } from './LazySketchesCarousel'

export const SketchesSection = async () => {
  const [images, requestedLocale, t, playbackLabels] = await Promise.all([
    getSketchImages(),
    getLocale(),
    getTranslations('homePage.sketchesSection'),
    getTranslations('pageSpeedLabel.homeSlider')
  ])
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale
  const slides = images.map(({ url, alt, altRo, altUk, altIt, altEn, title }, index) => {
    const altByLocale = { ru: alt, ro: altRo, uk: altUk, it: altIt, en: altEn } satisfies Record<AppLocale, string | null>

    return {
      url,
      alt: altByLocale[locale]?.trim() || alt,
      title,
      position: t('position', { current: index + 1, total: images.length, title })
    }
  })

  return (
    <section aria-labelledby="sketches-title" className="bg-zinc-900">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container grid gap-6 py-16 sm:gap-8 lg:py-20">
        <header className="grid gap-3">
          <h2 id="sketches-title" className="text-3xl leading-tight font-bold text-white lg:text-4xl">
            <FoldText text={t('title')} />
          </h2>
          <p className="leading-relaxed text-zinc-300">{t('description')}</p>
        </header>

        {slides.length > 0 && (
          <LazySketchesCarousel
            images={slides}
            labels={{
              previous: t('previous'),
              next: t('next'),
              openImage: t('openImage'),
              pause: playbackLabels('pause'),
              play: playbackLabels('play')
            }}
          />
        )}
      </FadeContent>
    </section>
  )
}
