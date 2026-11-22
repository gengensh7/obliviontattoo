import { getTranslations } from 'next-intl/server'
import { getPathname } from '@/i18n/navigation'
import { courses } from '@/lib/courses'
import HeaderNavigation from './HeaderNavigation'
import { HeaderScrollWrapper } from './HeaderScrollWrapper'
import { LangSwitcher } from './LangSwitcher'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

export default async function HeaderMenu({ locale }: { locale: string }) {
  const t = await getTranslations('homePage')
  const labels = await getTranslations('pageSpeedLabel')
  const courseLabels = await getTranslations('coursesPage.details')
  const contactLabels = await getTranslations('contactsPage.cta')
  const links = t.raw('header.links') as { label: string; href: string }[]
  const courseLinks = [
    { label: courseLabels('catalog'), destination: '/course' },
    ...courses.map(({ key, path }) => ({ label: courseLabels(`${key}.menu`), destination: path }))
  ].map((link) => ({ ...link, href: getPathname({ locale, href: link.destination }) }))
  const mobileLabels = {
    studio: t('headerMobile.studio'),
    navigation: t('headerMobile.navigation'),
    close: t('headerMobile.close'),
    language: t('headerMobile.language'),
    home: t('headerMobile.home'),
    appointment: contactLabels('appointment'),
    workingHours: t('headerMobile.workingHours'),
    burgerMenu: labels('burgerMenu')
  }

  return (
    <HeaderScrollWrapper>
      <Logo locale={locale} alt={t('header.logoAlt')} />
      <div className="flex items-center gap-6 md:gap-10">
        <HeaderNavigation locale={locale} links={links} courseLinks={courseLinks} />
        <MobileMenu locale={locale} links={links} courseLinks={courseLinks} labels={mobileLabels} />
        <LangSwitcher locale={locale} ariaLabel={labels('translationButton')} />
      </div>
    </HeaderScrollWrapper>
  )
}
