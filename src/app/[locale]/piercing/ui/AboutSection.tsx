import { getTranslations } from 'next-intl/server'
import { FramerMotionContainer } from '@/shared/FramerMotionContainer'

type CatalogItem = { category: string; description: string }
type ProcessItem = { step: string; title: string; description: string }

export const AboutSection = async () => {
  const t = await getTranslations('piercingPage.aboutSection')

  const catalog = t.raw('catalog') as CatalogItem[]
  const process = t.raw('process') as ProcessItem[]

  return (
    <section className="bg-zinc-900 pb-20">
      <div className="container flex flex-col gap-10 sm:gap-15">
        <FramerMotionContainer className="space-y-8">
          <h2 className="text-center text-3xl font-bold text-white">{t('catalogTitle')}</h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.map((c, i) => (
              <div key={i} className="flex flex-col gap-6 rounded-lg bg-zinc-700 p-6">
                <h3 className="text-xl font-bold text-white">{c.category}</h3>
                <p className="text-white">{c.description}</p>
              </div>
            ))}
          </div>
        </FramerMotionContainer>

        <FramerMotionContainer
          className="flex flex-col gap-8 rounded-xl p-8 text-white"
        >
          <h2 className="text-center text-3xl font-bold wrap-break-word">{t('processTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {process.map((step, i) => (
              <div key={i} className="flex flex-col gap-4 text-center">
                <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-red-500 text-xl leading-none font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-white">{step.description}</p>
              </div>
            ))}
          </div>
        </FramerMotionContainer>
      </div>
    </section>
  )
}
