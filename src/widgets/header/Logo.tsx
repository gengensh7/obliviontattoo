'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default function Logo({ locale, alt }: { locale: string; alt: string }) {
  const pathname = usePathname()
  const isPermanent = pathname?.split('/').filter(Boolean).at(-1) === 'permanent'

  return (
    <Link href={locale === routing.defaultLocale ? '/' : `/${locale}`} data-gtm="nav-home-logo">
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
