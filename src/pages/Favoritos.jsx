import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { PLACES, ITINERARIES } from '../services/data'
import PlaceCard from '../components/ui/PlaceCard'

export default function Favoritos() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('places')
  const favouritePlaces = useStore((s) => s.favouritePlaces)
  const favouriteItineraries = useStore((s) => s.favouriteItineraries)

  const savedPlaces = PLACES.filter((p) => favouritePlaces.includes(p.id))
  const savedItins = ITINERARIES.filter((i) => favouriteItineraries.includes(i.id))
  const suggestions = PLACES.filter((p) => !favouritePlaces.includes(p.id)).slice(0, 3)
  const totalSaved = savedPlaces.length + savedItins.length

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-medium text-gray-900">{t('favourites.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{totalSaved} itens guardados até agora</p>
      </div>

      <div className="mx-4 mt-4 grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.favourites.summary_label')}
          </p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{savedPlaces.length}</p>
          <p className="text-sm text-gray-500">{t('pages.favourites.summary_saved_places')}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.favourites.summary_label')}
          </p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{savedItins.length}</p>
          <p className="text-sm text-gray-500">{t('pages.favourites.summary_saved_itineraries')}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.favourites.suggestion_title')}
          </p>
          <p className="mt-3 text-sm text-gray-700">
            {t('pages.favourites.summary_next_suggestion')}
          </p>
        </div>
      </div>

      <div className="flex gap-0 mx-4 mt-4 bg-gray-100 rounded-xl p-1">
        {['places', 'itineraries'].map((t_) => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border-0 cursor-pointer ${
              tab === t_ ? 'bg-white text-gray-900' : 'text-gray-500 bg-transparent'
            }`}
          >
            {t_ === 'places' ? t('favourites.places') : t('favourites.itineraries')}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        {tab === 'places' &&
          (savedPlaces.length === 0 ? (
            <Empty text={t('favourites.empty')} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={() => navigate(`/place/${place.id}`)}
                />
              ))}
            </div>
          ))}

        {tab === 'itineraries' &&
          (savedItins.length === 0 ? (
            <Empty text={t('favourites.empty')} />
          ) : (
            <div className="flex flex-col gap-3">
              {savedItins.map((itin) => (
                <div key={itin.id} className="card overflow-hidden flex gap-3 p-3">
                  <img
                    src={itin.image}
                    alt={itin.title}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between py-0.5 flex-1">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{itin.title}</p>
                      <p className="text-xs text-gray-500">
                        {itin.duration} · {itin.stops} paragens
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/roteiros')}
                      className="text-xs text-ekaya-orange font-medium text-left"
                    >
                      Ver roteiro →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {savedPlaces.length === 0 && savedItins.length === 0 && (
        <div className="mx-4 mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('pages.favourites.suggestions_title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{t('pages.favourites.suggestions_subtitle')}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {suggestions.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => navigate(`/place/${place.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Empty({ text }) {
  return (
    <div className="text-center py-16">
      <div className="text-4xl mb-3">⭐</div>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}
