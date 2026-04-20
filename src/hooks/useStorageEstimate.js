import { useEffect, useState } from 'react'

export function useStorageEstimate() {
  const [estimate, setEstimate] = useState(null)

  const refresh = async () => {
    if (!navigator.storage?.estimate) return
    const { usage = 0, quota = 0 } = await navigator.storage.estimate()
    setEstimate({ usage, quota, pct: quota ? usage / quota : 0 })
  }

  useEffect(() => {
    refresh()
  }, [])

  return { estimate, refresh }
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}
