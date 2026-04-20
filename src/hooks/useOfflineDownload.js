import { useCallback, useRef, useState } from 'react'
import { downloadOfflineBundle } from '../services/offlineDownload'

export function useOfflineDownload() {
  const [status, setStatus] = useState('idle') // idle | running | done | error | cancelled
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const abortRef = useRef(null)

  const start = useCallback(async () => {
    if (status === 'running') return
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('running')
    setProgress({ done: 0, total: 0 })
    try {
      const result = await downloadOfflineBundle({
        onProgress: (p) => setProgress(p),
        signal: controller.signal,
      })
      setStatus(result.aborted ? 'cancelled' : 'done')
    } catch {
      setStatus('error')
    } finally {
      abortRef.current = null
    }
  }, [status])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress({ done: 0, total: 0 })
  }, [])

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0

  return { status, progress, pct, start, cancel, reset }
}
