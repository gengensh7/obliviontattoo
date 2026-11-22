'use client'

import { MessageCircle } from 'lucide-react'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { CONTACT_TELEGRAM } from './contactLinks'

type JivoWindow = Window & {
  jivo_onLoadCallback?: () => void
  jivo_api?: { open: () => void }
}

export function LazyJivoChat({ label, fallbackLabel }: { label: string; fallbackLabel: string }) {
  const [status, setStatus] = useState<'loading' | 'requested' | 'ready' | 'unavailable'>('loading')
  const openOnLoad = useRef(false)

  useEffect(() => {
    const chat = window as JivoWindow
    if (chat.jivo_api) return

    const timeout = window.setTimeout(() => setStatus('unavailable'), 15000)
    const onLoad = () => {
      window.clearTimeout(timeout)
      setStatus('ready')
      if (openOnLoad.current) chat.jivo_api?.open()
    }
    chat.jivo_onLoadCallback = onLoad

    return () => {
      window.clearTimeout(timeout)
      delete chat.jivo_onLoadCallback
    }
  }, [])

  const buttonClass = 'consent-bottom fixed right-4 z-40 grid size-12 place-items-center rounded-full border border-zinc-600 bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 focus-visible:outline-white'
  return (
    <>
      <Script
        id="jivochat"
        src="https://code.jivosite.com/widget/w9UCfRlMLQ"
        strategy="afterInteractive"
        onReady={() => {
          if ((window as JivoWindow).jivo_api) setStatus('ready')
        }}
        onError={() => setStatus('unavailable')}
      />
      {status === 'unavailable' && (
        <a href={CONTACT_TELEGRAM} className={buttonClass} aria-label={fallbackLabel} title={fallbackLabel}>
          <MessageCircle aria-hidden="true" />
        </a>
      )}
      {(status === 'loading' || status === 'requested') && (
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            openOnLoad.current = true
            setStatus('requested')
          }}
          disabled={status === 'requested'}
          aria-busy={status === 'requested'}
          aria-label={label}
          title={label}
        >
          <MessageCircle aria-hidden="true" />
        </button>
      )}
    </>
  )
}
