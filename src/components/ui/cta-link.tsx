import Link from 'next/link'
import type { ComponentProps, ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/utils'

type CtaLinkProps = Omit<ComponentPropsWithRef<'a'>, 'href'> & { href: ComponentProps<typeof Link>['href'] }

export function CtaLink({ href, className, ...props }: CtaLinkProps) {
  const linkClass = cn(
    'cta-link relative isolate overflow-hidden',
    'border-brand-red bg-brand-red inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-md border px-5 py-3 text-center text-sm/5 font-semibold text-white',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500',
    className
  )

  if (typeof href === 'string' && /^(?:#|\/\/|[a-z][a-z\d+.-]*:)/i.test(href)) {
    return <a {...props} href={href} className={linkClass} />
  }

  return <Link {...props} href={href} className={linkClass} />
}
