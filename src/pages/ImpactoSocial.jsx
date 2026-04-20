import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useStore } from '../store'
import { computeQuests } from '../services/gamification'

const SUPPORT_PROJECTS = [
  { id: 'artisans', titleKey: 'pages.impact.support_artisans' },
  { id: 'restoration', titleKey: 'pages.impact.support_restoration' },
  { id: 'education', titleKey: 'pages.impact.support_education' },
]

export default function ImpactoSocial() {
  const { t } = useTranslation()
  const state = useStore()
  const supportLocalProject = useStore((s) => s.supportLocalProject)
  const supported = state.socialSupportProjects || []
  const supportQuest = useMemo(() => computeQuests(state).find((q) => q.id === 'q5'), [state])

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="mx-4 mt-6 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-gradient-to-r from-emerald-600 to-sky-500 p-6 text-white">
          <h1 className="text-2xl font-semibold">{t('features.social.title')}</h1>
          <p className="mt-2 text-sm text-white/80">{t('pages.impact.subtitle')}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('pages.impact.section1_title')}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{t('pages.impact.section1_text')}</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('pages.impact.section2_title')}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{t('pages.impact.section2_text')}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('pages.impact.section3_title')}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{t('pages.impact.section3_text')}</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('pages.impact.section4_title')}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{t('pages.impact.section4_text')}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('pages.impact.stats_title')}
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                Impacto real
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">32</p>
                <p className="text-xs text-gray-500 mt-1">{t('pages.impact.stats_artisans')}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">8</p>
                <p className="text-xs text-gray-500 mt-1">{t('pages.impact.stats_projects')}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-semibold text-gray-900">1.200</p>
                <p className="text-xs text-gray-500 mt-1">{t('pages.impact.stats_visitors')}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-900">
                {t('pages.impact.support_title')}
              </h2>
              {supportQuest && (
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">
                  {supportQuest.current}/{supportQuest.target}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{t('pages.impact.support_subtitle')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {SUPPORT_PROJECTS.map((project) => {
                const done = supported.includes(project.id)
                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-gray-100 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-gray-900">{t(project.titleKey)}</p>
                    <button
                      type="button"
                      disabled={done}
                      onClick={() => supportLocalProject(project.id)}
                      className={`mt-3 w-full rounded-full px-3 py-2 text-xs font-medium ${
                        done
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {done ? t('pages.impact.support_done') : t('pages.impact.support_cta')}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
