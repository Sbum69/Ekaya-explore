import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PLACES } from '../services/data'
import { useStore } from '../store'

export default function PlaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const place = PLACES.find((p) => p.id === id)
  const toggleFav = useStore((s) => s.toggleFavouritePlace)
  const isFav = useStore((s) => s.isFavouritePlace(id))
  const markVisited = useStore((s) => s.markVisited)

  useEffect(() => {
    if (place) markVisited(place.id)
  }, [place, markVisited])

  if (!place) return <div className="p-8 text-center text-gray-500">Local não encontrado.</div>

  return (
    <div className="min-h-screen bg-ekaya-bg pb-8">
      <div className="relative h-64">
        <img
          src={place.image}
          alt={place.name}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white rounded-full flex items-center justify-center border-0 cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => toggleFav(place.id)}
          className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center border-0 cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFav ? '#e8510a' : 'none'}
            stroke={isFav ? '#e8510a' : '#555'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="bg-white mx-4 -mt-6 rounded-2xl p-5 relative z-10">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h1 className="text-xl font-medium text-gray-900">{place.name}</h1>
          <div className="flex items-center gap-1 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{place.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {place.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">{place.description}</p>

        <button onClick={() => navigate('/map')} className="btn-primary w-full justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Ver no Mapa
        </button>
      </div>
    </div>
  )
}
