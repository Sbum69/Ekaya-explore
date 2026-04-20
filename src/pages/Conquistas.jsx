import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { computeBadges } from '../services/badges'
import { computeQuests, getLevelFromXp, getLevelProgress } from '../services/gamification'
import BadgeDetail from '../components/ui/BadgeDetail'

const progressPct = (b) =>
  b.progress.target ? Math.min(100, (b.progress.current / b.progress.target) * 100) : 0

export default function Conquistas() {
  const { t } = useTranslation()
  const state = useStore()
  const claimQuest = useStore((s) => s.claimQuest)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')
  const claimableRef = useRef(null)

  const badges = useMemo(() => computeBadges(state), [state])
  const quests = useMemo(() => computeQuests(state), [state])
  const unlocked = badges.filter((b) => b.unlocked)
  const inProgress = badges
    .filter((b) => !b.unlocked && b.progress.current > 0)
    .sort((a, b) => progressPct(b) - progressPct(a))
  const locked = badges
    .filter((b) => !b.unlocked && b.progress.current === 0)
    .sort((a, b) => a.title.localeCompare(b.title))
  const pct = Math.round((unlocked.length / badges.length) * 100)
  const nextBadge = inProgress[0] ?? locked[0] ?? null
  const level = getLevelFromXp(state.xp)
  const levelProgress = getLevelProgress(state.xp)
  const claimableQuests = quests.filter((q) => q.claimable)

  useEffect(() => {
    if (claimableRef.current === null) {
      claimableRef.current = claimableQuests.length
      return
    }
    const hasMoreClaimables = claimableQuests.length > claimableRef.current
    claimableRef.current = claimableQuests.length
    if (!hasMoreClaimables) return
    setToast(t('pages.achievements.quest_claimable_toast', { count: claimableQuests.length }))
    const timeoutId = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timeoutId)
  }, [claimableQuests.length, t])

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-medium text-gray-900">{t('features.achievements.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {unlocked.length} / {badges.length} {t('pages.achievements.unlocked_count')}
        </p>
      </div>

      <div className="mx-4 grid gap-3 sm:grid-cols-3 mb-6">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.achievements.progress_title')}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{pct}%</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.achievements.level')}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {level} · {state.xp} XP
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {levelProgress.current}/{levelProgress.target}
          </p>
        </div>
        <button
          type="button"
          onClick={() => nextBadge && setSelected(nextBadge)}
          disabled={!nextBadge}
          className="card p-4 text-left transition hover:shadow-md disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2"
        >
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.achievements.next_goal_title')}
          </p>
          {nextBadge ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl">{nextBadge.icon}</span>
              <span className="text-sm text-gray-700 line-clamp-2">{nextBadge.title}</span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-700">{t('pages.achievements.all_unlocked')}</p>
          )}
        </button>
      </div>

      <div className="mx-4 mb-6">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="bg-ekaya-orange h-2 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${levelProgress.pct}%` }}
          />
        </div>
      </div>

      <section className="mt-6 px-4">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-[.15em]">
            {t('pages.achievements.quests_title')}
          </h2>
          <span className="text-xs text-gray-500">
            {claimableQuests.length} {t('pages.achievements.quests_claimable')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quests.map((quest) => (
            <div key={quest.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t(quest.titleKey)}</p>
                  <p className="text-xs text-gray-500 mt-1">{t(quest.descKey)}</p>
                </div>
                <span className="text-xs font-semibold text-indigo-600">+{quest.rewardXp} XP</span>
              </div>
              <div className="mt-2">
                <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 text-[11px] px-2 py-1 font-medium">
                  {quest.cadence === 'daily'
                    ? t('pages.achievements.quest_daily')
                    : t('pages.achievements.quest_weekly')}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {quest.current}/{quest.target}
                  </span>
                  <span>
                    {quest.claimed
                      ? t('pages.achievements.quest_claimed')
                      : quest.completed
                        ? t('pages.achievements.quest_completed')
                        : t('pages.achievements.quest_in_progress')}
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-400 transition-[width] duration-300"
                    style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={!quest.claimable}
                onClick={() => {
                  claimQuest(quest.id, quest.rewardXp, quest.cadence, quest.cycleKey)
                  setToast(t('pages.achievements.quest_claim_toast', { xp: quest.rewardXp }))
                }}
                className={`mt-3 w-full rounded-full px-4 py-2 text-sm font-medium transition ${
                  quest.claimable
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {quest.claimable
                  ? t('pages.achievements.quest_claim')
                  : quest.claimed
                    ? t('pages.achievements.quest_claimed')
                    : t('pages.achievements.quest_locked')}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Section
        title={t('pages.achievements.section_unlocked')}
        count={unlocked.length}
        badges={unlocked}
        emptyText={t('pages.achievements.no_unlocked_yet')}
        onSelect={setSelected}
      />
      {inProgress.length > 0 && (
        <Section
          title={t('pages.achievements.section_in_progress')}
          count={inProgress.length}
          badges={inProgress}
          onSelect={setSelected}
        />
      )}
      <Section
        title={t('pages.achievements.section_locked')}
        count={locked.length}
        badges={locked}
        emptyText={t('pages.achievements.no_locked_remaining')}
        onSelect={setSelected}
      />

      <BadgeDetail badge={selected} onClose={() => setSelected(null)} />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white text-xs px-4 py-2 shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}

function Section({ title, count, badges, emptyText, onSelect }) {
  return (
    <section className="mt-6 px-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-[.15em]">{title}</h2>
        <span className="text-xs text-gray-500">{count}</span>
      </div>
      {badges.length === 0 ? (
        emptyText && <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  )
}

function BadgeCard({ badge, onSelect }) {
  const { t } = useTranslation()
  const pct = Math.min(100, (badge.progress.current / badge.progress.target) * 100)
  return (
    <button
      type="button"
      onClick={() => onSelect(badge)}
      aria-label={`${badge.title} — ${t('pages.achievements.detail_open')}`}
      className={`card p-4 flex flex-col items-start gap-3 text-left transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2 ${
        badge.unlocked ? 'border-ekaya-orange' : 'opacity-90'
      }`}
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
            badge.unlocked ? 'bg-ekaya-orange-light' : 'bg-gray-100'
          }`}
        >
          {badge.unlocked ? badge.icon : '🔒'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{badge.title}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{badge.desc}</p>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium ${
              badge.unlocked ? 'text-ekaya-orange' : 'text-gray-500'
            }`}
          >
            {badge.unlocked ? t('pages.achievements.unlocked_label') : badge.goal}
          </span>
          <span className="text-xs text-gray-500">
            {badge.progress.current}/{badge.progress.target}
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${
              badge.unlocked ? 'bg-ekaya-orange' : 'bg-gray-300'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  )
}
