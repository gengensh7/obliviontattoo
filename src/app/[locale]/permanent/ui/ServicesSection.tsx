import { useTranslations } from 'next-intl'
import FadeContent from '@/shared/FadeContent'
import { PermanentCardData, ProductCard } from './ProductCard'

export const ServicesSection = () => {
  const t = useTranslations('permanentPage.serviceSection')

  const list = t.raw('services') as PermanentCardData[]

  const images = [
    '/images/permanentPage/permanent-brovi-kishinev.webp',
    '/images/permanentPage/permanent-guby-kishinev.webp',
    '/images/permanentPage/permanent-resniti-kishinev.webp'
  ]

  return (
    <section className="bg-zinc-900 pb-20">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="container flex flex-col gap-20">
        <div className="flex flex-col gap-10">
          <h2 className="bg-linear-to-r from-white to-zinc-300 bg-clip-text text-center text-2xl font-bold text-transparent">{t('title')}</h2>
          <p className="mx-auto max-w-3xl text-center text-zinc-400">{t('text')}</p>
        </div>

        <div className="grid h-full grid-cols-1 gap-15 md:grid-cols-2 xl:grid-cols-3">
          {list.map((item, i) => (
            <ProductCard key={i} item={item} image={images[i] ?? images[0]} />
          ))}
        </div>
      </FadeContent>
    </section>
  )
}
