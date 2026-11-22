'use client'

import { ArrowUpRight, ChevronDown, Menu, Phone, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CtaLink } from '@/components/ui/cta-link'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getPathname } from '@/i18n/navigation'
import { CONTACT_INSTAGRAM, CONTACT_PHONE, CONTACT_TELEGRAM, CONTACT_VIBER, CONTACT_WHATSAPP } from '@/lib/contactLinks'
import { cn } from '@/lib/utils'
import type { GooeyNavItem } from './GooeyNav'
import { LangSwitcher } from './LangSwitcher'
import { scrollToTop } from './scrollToTop'

const socialLinks = [
  { label: 'Instagram', href: CONTACT_INSTAGRAM, tracking: 'instagram' },
  { label: 'Telegram', href: CONTACT_TELEGRAM, tracking: 'telegram' },
  { label: 'WhatsApp', href: CONTACT_WHATSAPP, tracking: 'whatsapp' },
  { label: 'Viber', href: CONTACT_VIBER, tracking: 'viber' }
]

const focusRing = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-red'
const feedback = 'motion-safe:transition-colors motion-safe:duration-150'
const quietControl = cn(
  'grid size-11 shrink-0 place-items-center rounded-md border border-white/10 bg-zinc-900 text-zinc-200 hover:border-white/20 hover:bg-zinc-800 active:bg-zinc-700',
  focusRing,
  feedback
)
const navRow = cn(
  'flex min-h-11 w-full items-center rounded-md px-3 py-2 text-base/snug font-medium',
  focusRing,
  feedback
)
const idleRow = 'text-zinc-100 hover:bg-white/5 active:bg-white/10'
const activeRow = 'bg-brand-red/15 text-red-300 hover:bg-brand-red/20 active:bg-brand-red/25'

type MobileMenuProps = {
  locale: string
  links: { label: string; href: string }[]
  courseLinks: GooeyNavItem[]
  labels: {
    studio: string
    navigation: string
    home: string
    appointment: string
    workingHours: string
    burgerMenu: string
    close: string
    language: string
  }
}

function MobileNavigation({ locale, links, courseLinks, labels, onHomeReselect }: MobileMenuProps & { onHomeReselect: () => void }) {
  const segments = useSelectedLayoutSegments().filter((segment) => !segment.startsWith('('))
  const currentPath = '/' + segments.join('/')
  const activeSection = segments.length ? '/' + segments[0] : '/'
  const [coursesOpen, setCoursesOpen] = useState(activeSection === '/course')

  return (
    <nav aria-label={labels.navigation} className="mobile-menu-navigation min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 py-3">
      <ul className="flex flex-col">
        {[{ label: labels.home, href: '/' }, ...links].map(({ href, label }) => {
          const active = href === activeSection

          return (
            <li key={href}>
              {href === '/course' ? (
                <Accordion
                  type="single"
                  collapsible
                  value={coursesOpen ? href : ''}
                  onValueChange={(value) => setCoursesOpen(value === href)}
                >
                  <AccordionItem value={href} className="border-0">
                    <AccordionTrigger className={cn(navRow, 'roboto', active ? activeRow : idleRow)}>
                      {label}
                      <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-zinc-400 group-aria-expanded:rotate-180 motion-safe:transition-transform motion-safe:duration-150" />
                    </AccordionTrigger>
                    <AccordionContent className="mobile-menu-courses" inert={!coursesOpen}>
                      <ul className="grid gap-0.5 rounded-md bg-zinc-900 py-1 ps-4 pe-1">
                        {courseLinks.map(({ href: courseHref, label: courseLabel, destination }) => {
                          const current = destination === currentPath

                          return (
                            <li key={destination}>
                              <SheetClose asChild>
                                <Link
                                  href={courseHref}
                                  aria-current={current ? 'page' : undefined}
                                  data-gtm="nav-link"
                                  data-gtm-destination={destination}
                                  className={cn(navRow, 'text-sm', current ? activeRow : idleRow)}
                                >
                                  {courseLabel}
                                </Link>
                              </SheetClose>
                            </li>
                          )
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <SheetClose asChild>
                  <Link
                    href={getPathname({ locale, href })}
                    onNavigate={href === '/' && currentPath === '/' ? (event) => {
                      event.preventDefault()
                      onHomeReselect()
                    } : undefined}
                    aria-current={href === currentPath ? 'page' : undefined}
                    data-gtm={href === '/' ? 'nav-home' : href === '/contacts' ? 'nav-contacts' : 'nav-link'}
                    data-gtm-destination={href === '/' ? undefined : href}
                    className={cn(navRow, active ? activeRow : idleRow)}
                  >
                    {label}
                  </Link>
                </SheetClose>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function MobileMenu({ locale, links, courseLinks, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const scrollHomeOnClose = useRef(false)

  useEffect(() => {
    if (!open) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [open])

  return (
    <div className="flex items-center lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label={labels.burgerMenu}
          className={cn('grid size-11 place-items-center rounded-md text-brand-red active:bg-brand-red/10', focusRing, feedback)}
        >
          <Menu aria-hidden="true" className="size-6" />
        </SheetTrigger>

        <SheetContent
          side="left"
          onCloseAutoFocus={() => {
            if (!scrollHomeOnClose.current) return
            scrollHomeOnClose.current = false
            requestAnimationFrame(scrollToTop)
          }}
          className="mobile-menu-drawer h-dvh max-w-100 gap-0 border-white/10 text-zinc-100 shadow-xl shadow-black/30 transition-none sm:max-w-100 lg:hidden"
          overlayClassName="mobile-menu-overlay bg-black/65 lg:hidden"
          showCloseButton={false}
        >
          <SheetHeader className="flex-row items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
            <div className="grid min-w-0 gap-0.5">
              <SheetTitle className="montserrat text-lg/tight font-bold tracking-tight text-zinc-50">Oblivion Tattoo</SheetTitle>
              <SheetDescription className="text-xs font-medium tracking-wide text-zinc-400 uppercase">{labels.studio}</SheetDescription>
            </div>
            <SheetClose aria-label={labels.close} className={quietControl}>
              <X aria-hidden="true" className="size-5" />
            </SheetClose>
          </SheetHeader>

          <div className="mobile-menu-body flex min-h-0 flex-1 flex-col">
            <Suspense>
              <MobileNavigation
                locale={locale}
                links={links}
                courseLinks={courseLinks}
                labels={labels}
                onHomeReselect={() => { scrollHomeOnClose.current = true }}
              />
            </Suspense>

            <div className="grid shrink-0 gap-2.5 border-t border-white/10 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <a
                    href={CONTACT_PHONE}
                    data-gtm="phone"
                    className={cn('inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-sm font-semibold text-zinc-100 tabular-nums hover:text-red-300 active:text-red-300', focusRing, feedback)}
                  >
                    <Phone aria-hidden="true" className="size-4 shrink-0 text-brand-red" />
                    <span>+373 79 146 506</span>
                  </a>
                  <p className="text-xs/4 text-zinc-400">{labels.workingHours}</p>
                </div>
                <LangSwitcher locale={locale} ariaLabel={labels.language} variant="drawer" onChange={() => setOpen(false)} />
              </div>

              <CtaLink
                href={CONTACT_TELEGRAM}
                data-gtm="telegram"
                target="_blank"
                rel="noopener noreferrer"
                className={cn('w-full px-3 active:bg-red-700', feedback)}
              >
                {labels.appointment}
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </CtaLink>

              <ul className="grid grid-cols-4 gap-2">
                {socialLinks.map(({ label, href, tracking }) => (
                  <li key={tracking}>
                    <a
                      href={href}
                      aria-label={label}
                      data-gtm={tracking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(quietControl, 'w-full')}
                    >
                      <Image src={`/icons/social/${tracking}.svg`} alt="" width={18} height={18} unoptimized />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
