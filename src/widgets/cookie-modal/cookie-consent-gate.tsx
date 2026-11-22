import 'server-only'

import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { AnalyticsGate } from './analytics-gate'
import { CookieModal } from './cookie-modal'
import { COOKIE_CONSENT_KEY, isCookieConsent } from './constants'

export async function CookieConsentGate() {
  const [cookieStore, t] = await Promise.all([cookies(), getTranslations('cookieConsent')])
  const value = cookieStore.get(COOKIE_CONSENT_KEY)?.value
  const consent = isCookieConsent(value) ? value : undefined

  return (
    <>
      <CookieModal
        consent={consent}
        labels={{
          settings: t('settings'),
          description: t('description'),
          accept: t('accept'),
          reject: t('reject'),
          error: t('error')
        }}
      />
      <AnalyticsGate consent={consent} />
    </>
  )
}
