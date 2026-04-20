import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  buildPackingChecklist,
  estimateTripBudget,
  getSeasonForMonth,
  PHRASEBOOK,
} from '../services/travelPlanner'

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({
  value: m,
  label: new Date(2026, m - 1, 1).toLocaleString('pt-PT', { month: 'long' }),
}))

function formatMzn(value) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'MZN',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Planeador() {
  const { t } = useTranslation()
  const [days, setDays] = useState(4)
  const [travellers, setTravellers] = useState(2)
  const [style, setStyle] = useState('comfort')
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const budget = useMemo(
    () => estimateTripBudget({ days, travellers, style }),
    [days, travellers, style],
  )
  const season = useMemo(() => getSeasonForMonth(month), [month])
  const checklist = useMemo(() => buildPackingChecklist(month), [month])

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="mx-4 mt-6 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-gradient-to-r from-sky-700 to-emerald-500 p-6 text-white">
          <h1 className="text-2xl font-semibold">{t('features.planner.title')}</h1>
          <p className="mt-2 text-sm text-white/90">{t('pages.planner.subtitle')}</p>
        </div>

        <div className="p-6 space-y-5">
          <section className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pages.planner.budget_title')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{t('pages.planner.budget_subtitle')}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-sm text-gray-700">
                {t('pages.planner.days')}
                <input
                  type="number"
                  min="1"
                  max="21"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="text-sm text-gray-700">
                {t('pages.planner.travellers')}
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
              <label className="text-sm text-gray-700">
                {t('pages.planner.style')}
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
                >
                  <option value="budget">{t('pages.planner.style_budget')}</option>
                  <option value="comfort">{t('pages.planner.style_comfort')}</option>
                  <option value="premium">{t('pages.planner.style_premium')}</option>
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-[.2em] text-gray-500">
                {t('pages.planner.estimate')}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{formatMzn(budget.total)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {formatMzn(budget.perDay)} {t('pages.planner.per_day')} • {budget.seasonHint}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pages.planner.season_title')}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-[200px,1fr]">
              <label className="text-sm text-gray-700">
                {t('pages.planner.month')}
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 bg-white"
                >
                  {MONTHS.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-900 font-semibold">
                  {season === 'dry'
                    ? t('pages.planner.season_dry')
                    : t('pages.planner.season_rainy')}
                </p>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                  {checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pages.planner.phrases_title')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{t('pages.planner.phrases_subtitle')}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PHRASEBOOK.map((phrase) => (
                <div key={phrase.pt} className="rounded-2xl bg-white border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-900">{phrase.pt}</p>
                  <p className="text-sm text-gray-600">{phrase.en}</p>
                  <p className="text-sm text-sky-700 mt-1">{phrase.emk}</p>
                  <p className="text-xs text-gray-500 mt-2">{phrase.useCase}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
