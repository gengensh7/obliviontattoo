'use server'

import { cookies } from 'next/headers'
import { COOKIE_CONSENT_KEY, isCookieConsent, type CookieConsent } from './constants'

export async function setCookieConsent(consent: CookieConsent) {
  if (!isCookieConsent(consent)) throw new Error('Invalid cookie consent')

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_CONSENT_KEY, consent, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })
}
