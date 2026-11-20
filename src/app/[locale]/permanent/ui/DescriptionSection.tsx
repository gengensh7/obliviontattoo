import { useTranslations } from 'next-intl'
import FadeContent from '@/shared/FadeContent'

export const DescriptionSection = () => {
  const t = useTranslations('permanentPage.descriptionSection')

  return (
    <section className="bg-zinc-900 py-20">
      <div className="container">
        <FadeContent effect="focus" duration={0.44} initialOpacity={0.3} className="mx-auto flex max-w-4xl flex-col gap-8 text-center text-zinc-200">
          <h2 className="bg-linear-to-r from-white to-zinc-300 bg-clip-text text-3xl font-bold text-transparent">{t('title')}</h2>
          <p className="text-lg leading-relaxed">{t('text')}</p>
        </FadeContent>
      </div>
    </section>
  )
}
