'use client'

import { Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppLocale, routing } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import GlassSurface from './GlassSurface'

type LangSwitcherProps = {
  locale: string
  ariaLabel: string
  variant?: 'header' | 'drawer'
  onChange?: () => void
}

export const LangSwitcher = ({ locale, ariaLabel, variant = 'header', onChange }: LangSwitcherProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const inDrawer = variant === 'drawer'

  const handleLanguageChange = (newLocale: AppLocale) => {
    onChange?.()
    startTransition(() => {
      const segments = window.location.pathname.split('/')
      if (routing.locales.includes(segments[1] as AppLocale)) segments.splice(1, 1)
      const path = segments.join('/') || '/'
      const query = path === '/gallery' ? window.location.search : ''
      router.push(getPathname({ locale: newLocale, href: path }) + query)
    })
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange} disabled={isPending}>
      <div className="relative isolate">
        {!inDrawer && <GlassSurface visible className="inset-0 rounded-full group-data-scrolled/header:opacity-0" />}
        <SelectTrigger
          aria-label={ariaLabel}
          data-gtm="language-switcher"
          className={inDrawer
            ? 'h-11! gap-1.5 rounded-md border-white/10 bg-zinc-900 px-2.5 text-zinc-100 shadow-none hover:bg-zinc-800 active:bg-zinc-700 focus-visible:border-white/10 focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-red motion-safe:transition-colors motion-safe:duration-150'
            : 'relative min-w-30 rounded-full border-transparent text-white shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-data-scrolled/header:border-white/20 lg:h-11! xl:h-12! [&>svg]:text-white!'}
        >
          <Languages aria-hidden="true" className={inDrawer ? 'text-zinc-300' : 'text-white'} size={16} />
          <SelectValue>{locale.toUpperCase()}</SelectValue>
        </SelectTrigger>
      </div>
      <SelectContent
        align={inDrawer ? 'end' : undefined}
        className={inDrawer
          ? 'dark z-60 rounded-md border-white/15 bg-zinc-900 text-white motion-reduce:animate-none'
          : 'rounded-xl border-white/15 bg-zinc-950/80 text-white backdrop-blur-md backdrop-saturate-150 motion-reduce:animate-none'}
      >
        {routing.locales.map((localeOption) => (
          <SelectItem key={localeOption} value={localeOption} className={inDrawer ? 'min-h-11' : undefined} data-gtm="language-switch" data-gtm-locale={localeOption}>
            <div className="flex items-center gap-2">{localeOption.toUpperCase()}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
