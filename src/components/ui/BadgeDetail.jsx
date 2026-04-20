import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function BadgeDetail({ badge, onClose }) {
  const { t } = useTranslation()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!badge) return null

  const { current, target } = badge.progress
  const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-detail-title"
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 ${
              badge.unlocked ? 'bg-ekaya-orange-light' : 'bg-gray-100'
            }`}
          >
            {badge.unlocked ? badge.icon : '🔒'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="badge-detail-title" className="text-lg font-semibold text-gray-900">
              {badge.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{badge.desc}</p>
            <span
              className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                badge.unlocked
                  ? 'bg-ekaya-orange/10 text-ekaya-orange'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {badge.unlocked
                ? t('pages.achievements.unlocked_label')
                : t('pages.achievements.locked_label')}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.achievements.detail_criteria')}
          </p>
          <p className="mt-2 text-sm text-gray-800">{badge.goal}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[.2em] text-gray-500">
              {t('pages.achievements.detail_progress')}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {current} / {target}
            </p>
          </div>
          <div
            className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={target}
            aria-valuenow={current}
          >
            <div
              className={`h-full rounded-full transition-all ${
                badge.unlocked ? 'bg-ekaya-orange' : 'bg-gray-400'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700"
        >
          {t('pages.achievements.detail_close')}
        </button>
      </div>
    </div>
  )
}
