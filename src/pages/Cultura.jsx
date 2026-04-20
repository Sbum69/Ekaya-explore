import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ARTICLES, PLACES, TIMELINE } from '../services/data'
import PlaceCard from '../components/ui/PlaceCard'

const CATEGORIES = ['all', 'historia', 'arquitetura', 'cultura', 'gastronomia', 'comunidade']

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
  } catch {
    return iso
  }
}

function ArticleCard({ article, featured = false }) {
  const { t } = useTranslation()
  return (
    <Link
      to={`/cultura/${article.slug}`}
      className={`card overflow-hidden flex flex-col transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2 ${
        featured ? 'sm:flex-row' : ''
      }`}
    >
      <div className={featured ? 'sm:w-2/5 flex-shrink-0' : ''}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover ${featured ? 'h-48 sm:h-full' : 'h-40'}`}
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatDate(article.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span>
            {article.readingTime} {t('articles.min_read')}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function Timeline() {
  const { t } = useTranslation()
  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        {t('pages.culture.timeline_title')}
      </h2>
      <p className="text-sm text-gray-500 mb-5">{t('pages.culture.timeline_subtitle')}</p>
      <ol className="relative border-l-2 border-ekaya-orange/30 ml-2 space-y-5">
        {TIMELINE.map((event) => (
          <li key={event.id} className="ml-5">
            <span
              className="absolute -left-[7px] w-3 h-3 rounded-full bg-ekaya-orange border-2 border-white"
              aria-hidden="true"
            />
            <p className="text-xs font-semibold text-ekaya-orange tracking-wider">{event.year}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{event.title}</p>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{event.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Cultura() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const culturalPlaces = PLACES.filter((p) => p.category === 'cultural')

  const sortedArticles = useMemo(
    () => [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [],
  )
  const filtered =
    category === 'all' ? sortedArticles : sortedArticles.filter((a) => a.category === category)
  const [featured, ...rest] = filtered

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="mx-4 mt-6 rounded-3xl overflow-hidden relative bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=1200&q=80"
          alt={t('features.culture.title')}
          fetchPriority="high"
          decoding="async"
          className="w-full h-64 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-semibold text-white">{t('features.culture.title')}</h1>
          <p className="text-sm text-white/80 mt-2">{t('pages.culture.subtitle')}</p>
        </div>
      </div>

      <section className="mx-4 mt-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-[.15em]">
            {t('articles.list_title')}
          </h2>
          <span className="text-xs text-gray-500">{filtered.length}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              onClick={() => setCategory(cat)}
              aria-selected={category === cat}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2 ${
                category === cat
                  ? 'bg-ekaya-orange text-white border-ekaya-orange'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {t(`articles.categories.${cat}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 mt-6">{t('articles.empty')}</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {featured && <ArticleCard article={featured} featured />}
            {rest.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mx-4 mt-8">
        <Timeline />
      </section>

      <section className="mx-4 mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pages.culture.highlight_title')}
            </h2>
            <p className="text-sm text-gray-500">{t('pages.culture.highlight_subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="text-sm text-ekaya-orange font-semibold"
          >
            {t('pages.culture.view_map')}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {culturalPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => navigate(`/place/${place.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
