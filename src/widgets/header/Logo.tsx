'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { routing } from '@/i18n/routing'
import { scrollToTop } from './scrollToTop'

type Props = { locale: string; alt: string }

function LogoLink({ locale, alt, pathname }: Props & { pathname?: string }) {
  const href = locale === routing.defaultLocale ? '/' : `/${locale}`
  const isPermanent = pathname?.split('/').filter(Boolean).at(-1) === 'permanent'

  return (
    <Link
      href={href}
      data-gtm="nav-home-logo"
      onNavigate={pathname === href ? (event) => {
        event.preventDefault()
        scrollToTop()
      } : undefined}
    >
      <Image
        src={isPermanent ? '/logo-fucshia.svg' : '/logo.svg'}
        alt={alt}
        width={256}
        height={362}
        className="h-auto w-12"
        loading="eager"
        unoptimized
      />
    </Link>
  )
}

function RouteLogo(props: Props) {
  const pathname = usePathname()
  return <LogoLink {...props} pathname={pathname} />
}

export default function Logo(props: Props) {
  return <Suspense fallback={<LogoLink {...props} />}><RouteLogo {...props} /></Suspense>
}
