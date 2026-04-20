import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTranslation } from 'react-i18next'

export default function PWAUpdatePrompt() {
  const { t } = useTranslation()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  if (!needRefresh && !offlineReady) return null

  const close = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-xs w-[90%]">
      <div className="flex-1 text-sm text-gray-800">
        {needRefresh ? t('pwa.new_version') : t('pwa.ready_offline')}
      </div>
      {needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="btn-primary text-xs py-1.5 px-3"
        >
          {t('pwa.refresh')}
        </button>
      )}
      <button
        onClick={close}
        aria-label="close"
        className="text-gray-500 hover:text-gray-700 text-sm px-1"
      >
        ×
      </button>
    </div>
  )
}
