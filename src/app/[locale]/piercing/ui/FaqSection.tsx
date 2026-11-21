import { getLocale, getTranslations } from 'next-intl/server'
import { CtaLink } from '@/components/ui/cta-link'
import { getPathname } from '@/i18n/navigation'
import FadeContent from '@/shared/FadeContent'
import { FaqSection as SharedFaqSection } from '@/shared/FaqSection'

export async function FaqSection() {
  const locale = await getLocale()
  const t = await getTranslations('piercingPage')

  return (
    <div className="bg-zinc-900">
      <FadeContent effect="focus" duration={0.44} initialOpacity={0.3}>
        <SharedFaqSection titleId="piercing-faq-title" title={t('faq.title')} items={t.raw('faq.items')} className="py-20">
          <CtaLink href={getPathname({ locale, href: '/contacts' })} data-gtm="piercing-contacts" className="w-full sm:w-auto">
            {t('latestPiercingSection.contactsLink')}
          </CtaLink>
        </SharedFaqSection>
      </FadeContent>
    </div>
  )
}
