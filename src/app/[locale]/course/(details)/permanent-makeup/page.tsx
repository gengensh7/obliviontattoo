import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { courseByKey } from '@/lib/courses'
import { withSeo } from '@/lib/metadata'
import { ContactsSection } from '@/shared/ContactsSection'
import { FaqSection } from '@/shared/FaqSection'
import { CourseHero, CourseOverview, CourseProgram, CourseStructuredData } from '../../ui/CourseSections'

const course = courseByKey.permanent

export const generateMetadata = withSeo('metadata.permanentCourse', course.path)

export default async function PermanentMakeupCoursePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'coursesPage' })

  return (
    <main className="bg-zinc-950 text-white selection:bg-rose-800 selection:text-white">
      <CourseHero course={course} locale={locale} />
      <CourseOverview course={course} locale={locale} />
      <CourseProgram title={t('details.program')} items={t.raw('details.permanent.program')} />
      <div className="border-t border-zinc-800 bg-zinc-900 pt-12 sm:pt-16">
        <FaqSection
          titleId="course-faq-title"
          title={t('details.permanent.faqTitle')}
          items={t.raw('details.permanent.faq')}
          className="pb-14 lg:pb-20"
        />
        <ContactsSection title={t('details.permanent.contactTitle')} text={t('booking')} showNightSessions={false} />
      </div>
      <CourseStructuredData course={course} locale={locale} />
    </main>
  )
}
