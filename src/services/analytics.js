const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN
const HOST = import.meta.env.VITE_PLAUSIBLE_HOST || 'https://plausible.io'

let loaded = false

export function initAnalytics() {
  if (loaded || !DOMAIN || typeof document === 'undefined') return
  loaded = true
  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = DOMAIN
  script.src = `${HOST}/js/script.js`
  document.head.appendChild(script)
}

export function trackPageview() {
  if (!DOMAIN || typeof window === 'undefined') return
  window.plausible?.('pageview')
}
