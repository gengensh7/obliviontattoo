import { getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

export async function GalleryHero() {
  const [t, booking] = await Promise.all([getTranslations('galleryPage'), getTranslations('contactsPage.cta')])
  const title = t.markup('title', { studio: (name) => `\n${name}\n` }).trim()
  return (
    <section aria-labelledby="gallery-title" className="relative isolate flex min-h-screen items-center overflow-hidden bg-zinc-950 pt-24 pb-10 sm:pt-28 sm:pb-12">
      <DottedGlowBackground
        className="-z-20 mask-radial-from-35% mask-radial-to-80%"
        gap={24}
        radius={1.1}
        color="#ce757e"
        glowColor="#b83c54"
        opacity={0.68}
        speedScale={0.5}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-transparent to-zinc-950" />
      <FadeContent effect="focus" trigger="mount" duration={0.52} initialOpacity={0.8} className="container grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <h1 id="gallery-title" className="text-5xl leading-none font-bold tracking-tight text-balance whitespace-pre-line text-white sm:text-7xl lg:col-span-7 xl:text-8xl">
          <FoldText text={title} />
        </h1>
        <div className="grid gap-4 lg:col-span-5">
          <h2 className="text-xl leading-tight font-bold text-pretty sm:text-3xl">
            <FoldText text={t('subtitle')} />
          </h2>
          <p className="text-base leading-relaxed text-pretty text-zinc-300 sm:text-lg">{t('text')}</p>
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <CtaLink href="#gallery" data-gtm="gallery-view-works">
              {t('viewWorks')}
            </CtaLink>
            <CtaLink href={CONTACT_TELEGRAM} data-gtm="gallery-consultation">
              {booking('appointment')}
            </CtaLink>
          </div>
        </div>
      </FadeContent>
    </section>
  )
}
