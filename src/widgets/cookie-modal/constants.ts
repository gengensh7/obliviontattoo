export type CookieConsent = 'accepted' | 'rejected'

export const COOKIE_CONSENT_KEY = 'cookie-consent'

export function isCookieConsent(value: unknown): value is CookieConsent {
  return value === 'accepted' || value === 'rejected'
}
