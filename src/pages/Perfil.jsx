import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { useAuth } from '../hooks/useAuth'
import { useStorageEstimate, formatBytes } from '../hooks/useStorageEstimate'
import { countUnlocked } from '../services/badges'

function formatJoinDate(iso, lang) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', {
    year: 'numeric',
    month: 'long',
  })
}

export default function Perfil() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const state = useStore()
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const notificationsEnabled = useStore((s) => s.notificationsEnabled)
  const setNotificationsEnabled = useStore((s) => s.setNotificationsEnabled)
  const { estimate } = useStorageEstimate()

  const badgesUnlocked = countUnlocked(state)

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const handleLangToggle = () => {
    const next = lang === 'pt' ? 'en' : 'pt'
    setLang(next)
    i18n.changeLanguage(next)
  }

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-medium text-gray-900">{t('profile.title')}</h1>
      </div>

      <div className="mx-4 card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ekaya-purple to-ekaya-pink flex items-center justify-center text-white text-xl font-medium">
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            {t('profile.joined')}: {formatJoinDate(user?.joinedAt, lang)}
          </p>
        </div>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">{state.favouritePlaces.length}</p>
          <p className="text-[11px] uppercase tracking-[.15em] text-gray-500 mt-1">
            {t('dashboard.saved_places')}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {state.favouriteItineraries.length}
          </p>
          <p className="text-[11px] uppercase tracking-[.15em] text-gray-500 mt-1">
            {t('dashboard.active_routes')}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">{badgesUnlocked}</p>
          <p className="text-[11px] uppercase tracking-[.15em] text-gray-500 mt-1">
            {t('dashboard.badges_earned')}
          </p>
        </div>
      </div>

      <div className="mx-4 mt-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-[.15em] mb-3">
          {t('profile.settings')}
        </h2>

        <div className="card divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{t('profile.language')}</p>
              <p className="text-xs text-gray-500">{lang === 'pt' ? 'Português' : 'English'}</p>
            </div>
            <button onClick={handleLangToggle} className="pill text-xs">
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{t('profile.notifications')}</p>
              <p className="text-xs text-gray-500">{t('profile.notifications_desc')}</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              role="switch"
              aria-checked={notificationsEnabled}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-ekaya-orange' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          <div className="p-4">
            <p className="text-sm font-medium text-gray-900">{t('profile.offline_storage')}</p>
            {estimate && estimate.quota > 0 ? (
              <>
                <p className="text-xs text-gray-500 mt-1">
                  {formatBytes(estimate.usage)} / {formatBytes(estimate.quota)}
                </p>
                <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-ekaya-orange h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, estimate.pct * 100).toFixed(1)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-500 mt-1">{t('profile.storage_unknown')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          {t('auth.logout')}
        </button>
      </div>
    </div>
  )
}
