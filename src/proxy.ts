import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const defaultLocalePrefix = `/${routing.defaultLocale}`

  if (pathname === defaultLocalePrefix || pathname.startsWith(`${defaultLocalePrefix}/`)) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(defaultLocalePrefix.length) || '/'
    return NextResponse.redirect(url, 308)
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
}
