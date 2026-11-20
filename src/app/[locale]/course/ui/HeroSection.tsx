import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import { CONTACT_TELEGRAM } from '@/lib/contactLinks'
import { courses } from '@/lib/courses'

export const HeroSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations('coursesPage')

  return (
    <section className="relative flex items-center justify-center bg-zinc-900 pt-30 pb-20">
      <div className="container flex flex-col gap-10 text-white">
        <div className="flex flex-col gap-6 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{t('hero.title')}</h1>
          <p>{t('hero.lead')}</p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {courses.map(({ key, price, service, tracking }) => (
            <section key={key} id={`${key}-course`} className="flex scroll-mt-25 flex-col gap-5 rounded-lg bg-zinc-800 p-5">
              <h2 className="text-2xl font-bold">{t(`types.${key}.title`)}</h2>
              <p>{t(`types.${key}.audience`)}</p>
              <p className="text-3xl font-bold">{t('fee', { price })}</p>
              <p className="font-bold">{t(key === 'piercing' ? 'shortSchedule' : 'longSchedule')}</p>
              <p>{t(`types.${key}.text`)}</p>
              <p>{t(key === 'piercing' ? 'jewellery' : 'materials')}</p>
              <p>{t('document')}</p>
              <Link href={getPathname({ locale, href: service })} className="mt-auto underline underline-offset-4 hover:text-red-400">{t(`types.${key}.link`)}</Link>
              <p>{t('booking')}</p>
              <CtaLink href={CONTACT_TELEGRAM} data-gtm="telegram" data-gtm-course={tracking} target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-fit">
                {t('cta')}
              </CtaLink>
            </section>
          ))}
        </div>
        <Link href={getPathname({ locale, href: '/gallery' })} className="w-fit underline underline-offset-4 hover:text-red-400">{t('gallery')}</Link>
      </div>
    </section>
  )
}
