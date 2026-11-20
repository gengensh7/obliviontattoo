import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'

export async function FaqSection() {
  const locale = await getLocale()
  const t = await getTranslations('piercingPage')
  const items = t.raw('faq.items') as { question: string; answer: string }[]

  return (
    <section className="bg-zinc-900 py-20 text-white">
      <div className="container flex max-w-4xl flex-col gap-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">{t('faq.title')}</h2>
        {items.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-xl font-semibold">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
        <Link href={getPathname({ locale, href: '/contacts' })} data-gtm="piercing-contacts" className="mx-auto rounded-md bg-white px-6 py-4 font-bold text-black hover:text-red-500">
          {t('latestPiercingSection.contactsLink')}
        </Link>
      </div>
    </section>
  )
}
