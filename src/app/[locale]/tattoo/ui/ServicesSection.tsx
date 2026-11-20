import { getTranslations } from 'next-intl/server'
import { FramerMotionContainer } from '@/shared/FramerMotionContainer'
import { ServiceCard } from './ServiceCard'

export const ServicesSection = async () => {
  const t = await getTranslations('tattooPage.servicesSection')

  const list = t.raw('servicesCards') as {
    title: string
    text?: string
    size?: string
    price: string
    button: string
  }[]

  return (
    <section className="bg-zinc-900">
      <div className="container flex flex-col gap-12 py-20">
        <FramerMotionContainer>
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-center text-3xl font-bold text-white">{t('title')}</h2>
            <p className="text-center text-lg text-zinc-400">{t('description')}</p>
          </div>
        </FramerMotionContainer>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.map((item, i) => (
            <FramerMotionContainer key={i}>
              <ServiceCard {...item} />
            </FramerMotionContainer>
          ))}
        </div>
      </div>
    </section>
  )
}
