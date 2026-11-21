import { useTranslations } from 'next-intl'
import FadeContent from '@/shared/FadeContent'
import FoldText from '@/shared/FoldText'
import { PermanentCardData, ProductCard } from './ProductCard'

export const ServicesSection = () => {
  const t = useTranslations('permanentPage')

  const list = t.raw('serviceSection.services') as PermanentCardData[]

  const guide = t.raw('guide') as { title: string; text: string }[]

  const images = [
    '/images/permanentPage/permanent-brovi-kishinev.webp',
    '/images/permanentPage/permanent-guby-kishinev.webp',
    '/images/permanentPage/permanent-resniti-kishinev.webp'
  ]

  return (
    <section aria-labelledby="permanent-description" className="bg-zinc-900 pb-20">
      <div className="container flex flex-col gap-14 md:gap-16 lg:gap-20">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="grid items-start gap-4 text-left md:grid-cols-12 md:gap-8">
          <h2 id="permanent-description" className="text-3xl leading-tight font-bold tracking-tight text-balance text-white md:col-span-5 md:text-4xl xl:text-5xl">
            <FoldText text={t('descriptionSection.title')} />
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-200 md:col-span-7 lg:col-span-6 lg:col-start-7">
            {t('descriptionSection.text')}
          </p>
        </FadeContent>

        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col gap-3 text-left">
            <h2 className="text-2xl leading-tight font-bold tracking-tight text-white md:text-3xl">
              <FoldText text={t('serviceSection.title')} />
            </h2>
            <p className="max-w-xl leading-relaxed text-zinc-300">{t('serviceSection.text')}</p>
          </div>

          <div className="grid h-full grid-cols-1 gap-15 md:grid-cols-2 xl:grid-cols-3">
            {list.map((item, i) => (
              <ProductCard key={i} item={item} image={images[i] ?? images[0]} />
            ))}
          </div>
        </FadeContent>

        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="grid gap-6 md:grid-cols-2">
          {guide.map(({ title, text }) => (
            <div key={title} className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-white">
                <FoldText text={title} />
              </h2>
              <p className="leading-relaxed text-zinc-300">{text}</p>
            </div>
          ))}
        </FadeContent>
      </div>
    </section>
  )
}
