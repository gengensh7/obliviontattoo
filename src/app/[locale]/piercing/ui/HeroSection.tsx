import { Clock, Gem, MapPin } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { CtaLink } from '@/components/ui/cta-link'
import { SUPABASE_S3_URL } from '@/lib/config'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { getCurrentYear } from '@/lib/getCurrentYear'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

export const HeroSection = async () => {
  const [t, currentYear] = await Promise.all([getTranslations('piercingPage'), getCurrentYear()])
  const facts = [
    { Icon: Clock, label: t('heroSection.experience', { years: currentYear - 2018 }) },
    { Icon: MapPin, label: t('heroSection.address') },
    { Icon: Gem, label: t('heroSection.jewelry') }
  ]

  return (
    <section
      aria-labelledby="piercing-hero-title"
      className="relative isolate flex items-center bg-zinc-950 text-white selection:bg-rose-200 selection:text-zinc-950 lg:min-h-svh"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-zinc-950 via-zinc-950 to-red-950/40" />
      <BackgroundBeamsWithCollision />

      <FadeContent
        effect="focus"
        trigger="mount"
        duration={0.52}
        initialOpacity={0.8}
        className="container grid items-center gap-8 pt-28 pb-12 sm:gap-10 sm:pt-32 sm:pb-16 lg:grid-cols-12 lg:gap-8 lg:pt-24 xl:gap-12"
      >
        <div className="piercing-hero-copy flex min-w-0 flex-col items-start gap-6 sm:gap-8 lg:col-span-5">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h1 id="piercing-hero-title" className="service-hero-title font-extrabold tracking-tight text-balance">
              <FoldText text={t('heroSection.title')} />
            </h1>
            <p className="text-base/relaxed text-pretty text-zinc-300 sm:text-lg/relaxed">
              {t('heroSection.subtitle')}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" target="_blank" rel="noopener noreferrer" className="px-2 sm:px-5">
              {t('pricingSection.buttons.book')}
            </CtaLink>
            <CtaLink href="#pricing" className="px-2 sm:px-5">
              {t('heroSection.priceLink')}
            </CtaLink>
          </div>

          <ul role="list" className="flex w-full flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-4 text-sm text-zinc-300 sm:pt-5">
            {facts.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="piercing-hero-photos grid grid-cols-12 items-center gap-2 sm:gap-3 lg:col-span-7 lg:gap-4">
          <figure className="relative col-span-8 aspect-4/5 overflow-hidden rounded-xl bg-zinc-900 sm:aspect-square lg:aspect-4/5">
            <Image
              src={`${SUPABASE_S3_URL}/Piercing/piercing-1.webp`}
              alt={t('heroSection.photos.nostril.alt')}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1536px) 550px, (min-width: 1280px) 460px, (min-width: 1024px) 375px, (min-width: 768px) 490px, (min-width: 640px) 400px, 63vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-3 pt-8 pb-3 text-sm font-medium sm:px-5 sm:pb-5">
              {t('heroSection.photos.nostril.label')}
            </figcaption>
          </figure>

          <div className="col-span-4 grid gap-2 pt-5 sm:gap-3 sm:pt-8 lg:gap-4 lg:pt-14">
            <figure className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
              <Image
                src={`${SUPABASE_S3_URL}/Piercing/piercing-4.webp`}
                alt={t('heroSection.photos.eyebrow.alt')}
                fill
                sizes="(min-width: 1536px) 265px, (min-width: 1280px) 220px, (min-width: 1024px) 175px, (min-width: 768px) 235px, (min-width: 640px) 195px, 30vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-2 pt-5 pb-2 text-xs font-medium sm:px-3 sm:pb-3 sm:text-sm">
                {t('heroSection.photos.eyebrow.label')}
              </figcaption>
            </figure>

            <figure className="relative aspect-5/4 w-11/12 justify-self-end overflow-hidden rounded-xl bg-zinc-900">
              <Image
                src={`${SUPABASE_S3_URL}/Piercing/piercing-2.webp`}
                alt={t('heroSection.photos.septum.alt')}
                fill
                sizes="(min-width: 1536px) 245px, (min-width: 1280px) 205px, (min-width: 1024px) 160px, (min-width: 768px) 215px, (min-width: 640px) 180px, 28vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-2 pt-5 pb-2 text-xs font-medium sm:px-3 sm:pb-3 sm:text-sm">
                {t('heroSection.photos.septum.label')}
              </figcaption>
            </figure>
          </div>
        </div>
      </FadeContent>
    </section>
  )
}
