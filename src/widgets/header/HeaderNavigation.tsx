import NavigationLink from './NavigationLink'
import type { GooeyNavItem } from './GooeyNav'

export default function HeaderNavigation({ locale, links, courseLinks }: {
  locale: string
  links: { label: string; href: string }[]
  courseLinks: GooeyNavItem[]
}) {
  return (
    <nav className="hidden items-center gap-12 lg:flex lg:gap-20">
      <NavigationLink locale={locale} links={links} courseLinks={courseLinks} />
    </nav>
  )
}
