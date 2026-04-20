import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NOTIFICATIONS } from '../services/data'

const NEWS = [
  {
    id: 'news1',
    category: 'evento',
    title: 'Festival de Música Tradicional',
    body: 'Este fim de semana, a ilha recebe o festival anual de música e dança tradicional macua. Entrada gratuita.',
    date: '5 Abr 2026',
    icon: '🎵',
    color: '#7F77DD',
  },
  {
    id: 'news2',
    category: 'aviso',
    title: 'Manutenção da Estrada Principal',
    body: 'A estrada principal estará encerrada entre as 08h e as 14h nos dias 8 e 9 de Abril. Use rotas alternativas.',
    date: '4 Abr 2026',
    icon: '⚠️',
    color: '#d97706',
  },
  {
    id: 'news3',
    category: 'comunidade',
    title: 'Mercado de Artesanato Aberto',
    body: 'O novo mercado de artesanato local abre as suas portas. Apoie os artesãos da comunidade.',
    date: '3 Abr 2026',
    icon: '🛍️',
    color: '#16a34a',
  },
  {
    id: 'news4',
    category: 'evento',
    title: 'Visita Guiada ao Palácio',
    body: 'Visitas guiadas ao Palácio de São Paulo todos os sábados às 10h. Reserva obrigatória.',
    date: '1 Abr 2026',
    icon: '🏛️',
    color: '#2563eb',
  },
]

const CATEGORIES = ['all', 'evento', 'aviso', 'comunidade']

export default function Noticias() {
  const { t } = useTranslation()
  const [category, setCategory] = useState('all')

  const filteredNews = category === 'all' ? NEWS : NEWS.filter((item) => item.category === category)

  const categoryLabel = (cat) => {
    if (cat === 'all') return t('pages.news.filter_all')
    if (cat === 'evento') return t('pages.news.filter_event')
    if (cat === 'aviso') return t('pages.news.filter_alert')
    if (cat === 'comunidade') return t('pages.news.filter_community')
    return cat
  }

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-medium text-gray-900">{t('features.news.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('features.news.desc')}</p>
      </div>

      <div className="px-4 grid gap-3 sm:grid-cols-2 mb-4">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.news.updates_title')}
          </p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{NOTIFICATIONS.length}</p>
          <p className="text-sm text-gray-500 mt-1">{t('pages.news.recent_notifications')}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.news.events_title')}
          </p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">
            {NEWS.filter((item) => item.category === 'evento').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">{t('pages.news.events_title')}</p>
        </div>
      </div>

      <div className="mx-4 mb-4 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${category === cat ? 'bg-ekaya-orange text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          {t('pages.news.recent_notifications')}
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {NOTIFICATIONS.map((n, i) => (
            <div
              key={n.id}
              className={`flex gap-3 px-4 py-3 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-gray-50' : ''} ${n.read ? 'opacity-60' : ''}`}
            >
              <span className="text-xl flex-shrink-0">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                  {!n.read && (
                    <span className="w-2 h-2 bg-ekaya-orange rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{n.body}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">{t('pages.news.latest_news')}</h2>
        <div className="flex flex-col gap-3">
          {filteredNews.map((item) => (
            <div key={item.id} className="card p-4 flex gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: item.color + '20' }}
              >
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: item.color + '20', color: item.color }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
