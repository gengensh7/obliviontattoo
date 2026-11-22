const measurementId = 'G-N2KV7LWE10'
const analyticsCookies = new Set(['_ga', `_ga_${measurementId.slice(2)}`, '_clck', '_clsk'])

// Disable the GA4 property configured in GTM-5M92WL6J before leaving the document.
export function stopAnalytics() {
  // Clarity flushes its buffer with sendBeacon even on stop(). Block that final
  // transmission in this document while the same-origin Server Action saves.
  const policy = document.createElement('meta')
  policy.httpEquiv = 'Content-Security-Policy'
  policy.content = "connect-src 'self'; img-src 'self' data: blob:"
  document.head.appendChild(policy)
  Object.assign(window, { [`ga-disable-${measurementId}`]: true })
  window.va?.('beforeSend', () => null)
  window.si?.('beforeSend', () => null)
  const { clarity } = window as Window & { clarity?: (command: 'stop') => void }
  clarity?.('stop')
}

export function clearAnalyticsCookies() {
  const hostname = window.location.hostname.split('.')
  for (const entry of document.cookie.split(';')) {
    const name = entry.trim().split('=')[0]
    if (!analyticsCookies.has(name)) continue

    const expired = `${name}=; Max-Age=0; Path=/`
    document.cookie = expired
    // GA and Clarity can use a parent domain (for example, on a www host).
    for (let index = 0; index < hostname.length - 1; index++) {
      document.cookie = `${expired}; Domain=${hostname.slice(index).join('.')}`
    }
  }
}
