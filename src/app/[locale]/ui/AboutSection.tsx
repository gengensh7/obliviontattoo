import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { CtaLink } from '@/components/ui/cta-link'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'

export const AboutSection = async () => {
  const t = await getTranslations('homePage.aboutSection')

  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 bg-black/50"></div>
      <Image
        src="/images/homePage/about-section/about-1.webp"
        width={1920}
        height={1080}
        alt={t('imageAlt')}
        sizes="100vw"
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover grayscale"
      />
      <div className="relative z-1 container flex min-h-screen flex-col justify-center">
        <div>
          <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="ml-auto flex max-w-2xl flex-col gap-4">
            <h2 id="about-section-title" className="text-3xl font-bold text-white">
              <FoldText text={t('title')} />
            </h2>
            <p className="text-xl font-semibold text-white">{t('text')}</p>
            <p className="text-base text-white">{t('description')}</p>
            <CtaLink
              href={CONTACT_TELEGRAM}
              data-gtm="telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              {t('button')}
            </CtaLink>
          </FadeContent>
        </div>
      </div>
    </section>
  )
}
