import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import type { CookieConsent } from './constants'

export function AnalyticsGate({ consent }: { consent?: CookieConsent }) {
  if (consent !== 'accepted') return null

  // The published container owns GA4 page views, contact clicks and Clarity.
  return (
    <>
      <Script id="analytics-consent">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied'
          });
          gtag('set', 'allow_google_signals', false);
          window.clarity = window.clarity || function(){(window.clarity.q = window.clarity.q || []).push(arguments);};
          window.clarity('consentv2', {analytics_Storage: 'granted', ad_Storage: 'denied'});`}
      </Script>
      <GoogleTagManager gtmId="GTM-5M92WL6J" />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
