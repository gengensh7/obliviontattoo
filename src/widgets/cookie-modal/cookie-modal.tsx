'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { setCookieConsent } from './actions'
import { COOKIE_CONSENT_KEY, type CookieConsent } from './constants'
import { clearAnalyticsCookies, stopAnalytics } from './revoke-analytics'

type CookieModalProps = {
  consent?: CookieConsent
  labels: { settings: string; description: string; accept: string; reject: string; error: string }
}

export function CookieModal({ consent, labels }: CookieModalProps) {
  const [editing, setEditing] = useState(false)
  const [failed, setFailed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const settings = useRef<HTMLButtonElement>(null)
  const reject = useRef<HTMLButtonElement>(null)
  const channel = useRef<BroadcastChannel | null>(null)
  const visible = !consent || editing

  useEffect(() => {
    if (editing) reject.current?.focus({ preventScroll: true })
  }, [editing])

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return
    const updates = new BroadcastChannel(COOKIE_CONSENT_KEY)
    channel.current = updates
    updates.onmessage = ({ data }) => {
      if (data === consent) return
      if (data === 'rejected' && consent === 'accepted') {
        stopAnalytics()
        clearAnalyticsCookies()
      }
      window.location.reload()
    }
    return () => updates.close()
  }, [consent])

  function saveConsent(choice: CookieConsent) {
    const revoking = choice === 'rejected' && consent === 'accepted'
    if (revoking) stopAnalytics()

    setFailed(false)
    startTransition(async () => {
      try {
        await setCookieConsent(choice)
        if (choice === 'rejected') clearAnalyticsCookies()
        channel.current?.postMessage(choice)
        if (revoking || failed) {
          window.location.reload()
          return
        }
        setEditing(false)
        if (editing) settings.current?.focus({ preventScroll: true })
      } catch {
        setFailed(true)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        ref={settings}
        aria-expanded={visible}
        aria-controls={visible ? 'cookie-settings' : undefined}
        onClick={() => {
          setEditing(true)
          reject.current?.focus({ preventScroll: true })
        }}
        className="w-fit rounded-sm text-sm text-zinc-400 no-underline hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red motion-safe:transition-colors"
      >
        {labels.settings}
      </button>
      {visible && (
        <section
          id="cookie-settings"
          aria-label={labels.settings}
          className="consent-bottom fixed right-24 left-3 z-40 grid max-w-88 gap-2 rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-left shadow-sm sm:left-4"
        >
          <p className="text-xs leading-5 text-zinc-200">{labels.description}</p>
          {failed && <p role="alert" className="text-xs text-white">{labels.error}</p>}
          <div className="grid grid-cols-2 gap-2">
            {(['rejected', 'accepted'] as const).map((choice) => (
              <Button
                key={choice}
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                ref={choice === 'rejected' ? reject : undefined}
                className="h-11 border-zinc-600 bg-zinc-800 px-2 text-xs text-white hover:bg-zinc-700 hover:text-white focus-visible:ring-white sm:h-8"
                onClick={() => saveConsent(choice)}
              >
                {choice === 'accepted' ? labels.accept : labels.reject}
              </Button>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
