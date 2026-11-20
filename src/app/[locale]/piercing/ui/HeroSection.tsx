import { getCurrentYear } from '@/lib/getCurrentYear'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export const HeroSection = async () => {
  const t = await getTranslations('piercingPage.heroSection')

  const years = (await getCurrentYear()) - 2018

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-zinc-900 py-30 2xl:py-0">
      <div className="container flex flex-col items-center gap-10">
        <div className="flex flex-col gap-10">
          <h1 className="text-center text-3xl font-bold break-words text-white sm:text-4xl">{t('title')}</h1>
          <p className="mx-auto max-w-5xl text-center text-xl break-words text-gray-200">{t('experience', { years })} {t('text')}</p>
        </div>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3">
            <Image
              src="/images/piercingPage/piercing.webp"
              alt={t('imageAlt')}
              width={400}
              height={400}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1536px) 475px, (min-width: 1280px) 390px, (min-width: 1024px) 476px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 32px)"
              className="col-span-1 h-full w-full rounded-lg"
            />
            <div className="flex flex-col justify-between gap-10 xl:col-span-2">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-10">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-red-500 p-6 text-3xl font-bold text-white">1</div>
                <div className="flex flex-col gap-6 text-white">
                  <h2 className="text-center text-lg font-bold sm:text-left">{t('firstCard.title')}</h2>
                  <p className="text-center sm:text-left">{t('firstCard.text')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-10">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-red-500 p-6 text-3xl font-bold text-white">2</div>
                <div className="flex flex-col gap-6 text-white">
                  <h2 className="text-center text-lg font-bold sm:text-left">{t('secondCard.title')}</h2>
                  <p className="text-center sm:text-left">{t('secondCard.text')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-10">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-red-500 p-6 text-3xl font-bold text-white">3</div>
                <div className="flex flex-col gap-6 text-white">
                  <h2 className="text-center text-lg font-bold sm:text-left">{t('thirdCard.title')}</h2>
                  <p className="text-center sm:text-left">{t('thirdCard.text')}</p>
                  <a href="#pricing" className="text-center underline underline-offset-4 hover:text-red-400 sm:text-left">{t('priceLink')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
