import { useNavigate, useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ARTICLES } from '../services/data'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function Section({ section }) {
  if (section.type === 'heading') {
    return <h2 className="mt-8 text-xl font-semibold text-gray-900">{section.text}</h2>
  }
  if (section.type === 'quote') {
    return (
      <blockquote className="mt-6 border-l-4 border-ekaya-orange pl-4 italic text-gray-700">
        <p>“{section.text}”</p>
        {section.cite && <footer className="mt-2 text-xs text-gray-500">— {section.cite}</footer>}
      </blockquote>
    )
  }
  return <p className="mt-4 text-base leading-relaxed text-gray-800">{section.text}</p>
}

export default function Article() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const article = ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-ekaya-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-700">{t('articles.not_found')}</p>
          <Link to="/cultura" className="mt-4 inline-block text-ekaya-orange font-semibold">
            {t('articles.back_to_culture')}
          </Link>
        </div>
      </div>
    )
  }

  const related = ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category,
  ).slice(0, 3)

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="relative h-72 sm:h-96 bg-gray-900 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          aria-label={t('common.back')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-white/90 text-gray-800 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-white/80 mt-3 flex items-center gap-3">
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {article.readingTime} {t('articles.min_read')}
            </span>
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-5 mt-8">
        <p className="text-lg text-gray-700 leading-relaxed">{article.excerpt}</p>
        <div className="mt-2 h-px bg-gray-200" />
        {article.sections.map((section, i) => (
          <Section key={i} section={section} />
        ))}
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-2xl px-5 mt-12">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-[.15em] mb-4">
            {t('articles.related')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/cultura/${r.slug}`}
                className="card overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2"
              >
                <img
                  src={r.image}
                  alt={r.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.readingTime} {t('articles.min_read')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
