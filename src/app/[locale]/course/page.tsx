import { getTranslations } from 'next-intl/server'
import { buildCoursesJsonLd } from '@/lib/jsonld'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import { FaqSection } from '@/shared/FaqSection'
import { CertificateSection } from './ui/CertificateSection'
import { HeroSection } from './ui/HeroSection'

export const generateMetadata = withSeo('metadata.coursePageMetadata', '/course')

export default async function Course({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('coursesPage')

  return (
    <main className="flex flex-col bg-zinc-900">
      <HeroSection locale={locale} />
      <CertificateSection />
      <FaqSection titleId="course-faq-title" title={t('faq.title')} items={t.raw('faq.items')} />
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
