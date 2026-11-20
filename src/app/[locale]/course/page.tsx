import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPathname } from '@/i18n/navigation'
import { buildCoursesJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import { CertificateSection } from './ui/CertificateSection'
import { HeroSection } from './ui/HeroSection'

export const generateMetadata = withSeo('metadata.coursePageMetadata', '/course')

export default async function Course({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('coursesPage')
  const contacts = await getTranslations('homePage.contactsSection.contacts')
  const questions = t.raw('faq.items') as { question: string; answer: string }[]

  return (
    <main className="flex flex-col bg-zinc-900">
      <HeroSection locale={locale} />
      <CertificateSection />
      <section className="container pb-20 text-white">
        <h2 className="mb-4 text-3xl font-bold">{t('faq.title')}</h2>
        {questions.map(({ question, answer }) => (
          <details key={question} className="border-t border-gray-700 py-4">
            <summary className="cursor-pointer text-lg font-bold">{question}</summary>
            <p className="mt-3">{answer}</p>
          </details>
        ))}
      </section>
      <Link href={getPathname({ locale, href: '/contacts' })} data-gtm="course-contacts" className="mx-auto mb-20 rounded-md bg-white px-6 py-4 font-bold text-black hover:text-red-500">
        {contacts('title')}
      </Link>
      <ContactsSection title={t('contactTitle')} text={t('booking')} showNightSessions={false} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await buildCoursesJsonLd(locale)).replace(/</g, '\\u003c')
        }}
      />
    </main>
  )
}
