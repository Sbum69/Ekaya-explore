import { useEffect } from 'react'
import { useStore } from '../store'

export function useOffline() {
  const setOffline = useStore((s) => s.setOffline)
  const isOffline = useStore((s) => s.isOffline)

  useEffect(() => {
    const goOffline = () => setOffline(true)
    const goOnline = () => setOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [setOffline])

  return isOffline
}
