import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { countUnlocked } from '../services/badges'
import { getLevelFromXp } from '../services/gamification'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useOfflineDownload } from '../hooks/useOfflineDownload'
import { useStorageEstimate, formatBytes } from '../hooks/useStorageEstimate'
import StatCard from '../components/ui/StatCard'
import FeatureCard from '../components/ui/FeatureCard'
import FAB from '../components/layout/FAB'

const FEATURES = [
  {
    titleKey: 'features.map.title',
    descKey: 'features.map.desc',
    color: '#2563eb',
    path: '/map',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    titleKey: 'features.culture.title',
    descKey: 'features.culture.desc',
    color: '#e8510a',
    path: '/cultura',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.favourites.title',
    descKey: 'features.favourites.desc',
    color: '#D4537E',
    path: '/favoritos',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.news.title',
    descKey: 'features.news.desc',
    color: '#c0392b',
    path: '/noticias',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    titleKey: 'features.itineraries.title',
    descKey: 'features.itineraries.desc',
    color: '#d97706',
    path: '/roteiros',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.experiences.title',
    descKey: 'features.experiences.desc',
    color: '#16a34a',
    path: '/experiencias',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.information.title',
    descKey: 'features.information.desc',
    color: '#1d4ed8',
    path: '/informacoes',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    titleKey: 'features.achievements.title',
    descKey: 'features.achievements.desc',
    color: '#8b5cf6',
    path: '/conquistas',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 21l-1.5-4.5L6 14l4.5-1.5L12 8l1.5 4.5L18 14l-4.5 2.5L12 21z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.social.title',
    descKey: 'features.social.desc',
    color: '#059669',
    path: '/impacto-social',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    titleKey: 'features.planner.title',
    descKey: 'features.planner.desc',
    color: '#0f766e',
    path: '/planeador',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const state = useStore()
  const favouritePlaces = state.favouritePlaces
  const favouriteItineraries = state.favouriteItineraries
  const badgesUnlocked = countUnlocked(state)
  const level = getLevelFromXp(state.xp)
  const rewardFeed = Array.isArray(state.rewardFeed) ? state.rewardFeed.slice(0, 4) : []
  const { canInstall, installed, promptInstall } = useInstallPrompt()
  const { estimate, refresh: refreshEstimate } = useStorageEstimate()
  const download = useOfflineDownload()

  const handleDownload = async () => {
    if (canInstall && !installed) {
      await promptInstall()
    }
    await download.start()
    await refreshEstimate()
  }

  const running = download.status === 'running'
  const downloadLabel = running
    ? t('pwa.downloading')
    : download.status === 'done'
      ? t('pwa.download_complete')
      : download.status === 'error' || download.status === 'cancelled'
        ? t('pwa.download_retry')
        : installed
          ? t('dashboard.download_btn')
          : canInstall
            ? t('pwa.install')
            : t('dashboard.download_btn')

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      {/* Hero */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative h-64 bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
          alt="Ilha de Moçambique"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl font-medium text-white mb-2">{t('dashboard.hero_title')}</h2>
          <p className="text-sm text-white/85 mb-4">{t('dashboard.hero_sub')}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={running}
              aria-busy={running}
              className="btn-primary text-sm disabled:opacity-80"
            >
              {running ? (
                <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
              {downloadLabel}
            </button>
            {running && (
              <button
                onClick={download.cancel}
                className="text-xs text-white/90 underline underline-offset-2"
              >
                {t('pwa.download_cancel')}
              </button>
            )}
          </div>
          {(running || download.status === 'done') && download.progress.total > 0 && (
            <div className="mt-3" aria-live="polite">
              <div
                className="h-1.5 bg-white/25 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={download.pct}
              >
                <div
                  className="h-full bg-white transition-[width] duration-150"
                  style={{ width: `${download.pct}%` }}
                />
              </div>
              <p className="text-xs text-white/80 mt-1">
                {download.progress.done} / {download.progress.total} · {download.pct}%
              </p>
            </div>
          )}
          {estimate && estimate.quota > 0 && (
            <p className="text-xs text-white/80 mt-2">
              {t('pwa.storage_used')}: {formatBytes(estimate.usage)} / {formatBytes(estimate.quota)}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
        <StatCard
          gradient="linear-gradient(135deg, #7F77DD, #D4537E)"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
          value={favouritePlaces.length}
          label={t('dashboard.saved_places')}
        />
        <StatCard
          gradient="linear-gradient(135deg, #7F77DD, #1D9E75)"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          value={favouriteItineraries.length}
          label={t('dashboard.active_routes')}
        />
        <StatCard
          gradient="linear-gradient(135deg, #8F60DD, #D4537E)"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          }
          value={badgesUnlocked}
          label={t('dashboard.badges_earned')}
        />
      </div>

      <div className="mx-4 mt-3">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.achievements.level')}
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {level} · {state.xp} XP
          </p>
        </div>
      </div>

      <div className="mx-4 mt-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[.2em] text-gray-500">
              {t('dashboard.recent_rewards')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/conquistas')}
              className="text-xs text-ekaya-orange font-medium"
            >
              {t('common.details')}
            </button>
          </div>
          {rewardFeed.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{t('dashboard.recent_rewards_empty')}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {rewardFeed.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {entry.type === 'quest'
                      ? t('dashboard.reward_quest_claim')
                      : t(`dashboard.reward_${entry.rewardKey}`)}
                  </span>
                  <span className="font-semibold text-indigo-600">+{entry.xp} XP</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mx-4 mt-8">
        <h2 className="text-xl font-medium text-gray-900 mb-1">{t('features.title')}</h2>
        <p className="text-sm text-gray-500 mb-5">{t('features.subtitle')}</p>
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.path} {...f} />
          ))}
        </div>
      </div>

      <FAB />
    </div>
  )
}
