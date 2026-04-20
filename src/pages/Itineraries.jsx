import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ITINERARIES, PLACES } from '../services/data'
import { useStore } from '../store'
import FAB from '../components/layout/FAB'
import { ITINERARY_DIFFICULTY_COLORS } from '../domain/tourism'

export default function Itineraries() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toggleFav = useStore((s) => s.toggleFavouriteItinerary)
  const favItins = useStore((s) => s.favouriteItineraries)

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="px-4 pt-6 pb-4">
        <h2 className="text-xl font-medium text-gray-900">{t('features.experiences.title')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t('pages.experiences.subtitle')}</p>
      </div>

      <div className="mx-4 grid gap-3 sm:grid-cols-2 mb-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t('pages.experiences.card1_title')}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{t('pages.experiences.card1_text')}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t('pages.experiences.card2_title')}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{t('pages.experiences.card2_text')}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t('pages.experiences.card3_title')}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{t('pages.experiences.card3_text')}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t('pages.experiences.card4_title')}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{t('pages.experiences.card4_text')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {ITINERARIES.map((itin) => {
          const stops = PLACES.filter((place) => itin.placeIds.includes(place.id))
            .map((place) => place.name)
            .slice(0, 3)
          return (
            <div key={itin.id} className="card overflow-hidden">
              <div className="relative h-44">
                <img
                  src={itin.image}
                  alt={itin.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => toggleFav(itin.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center border-0 cursor-pointer"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill={favItins.includes(itin.id) ? '#e8510a' : 'none'}
                    stroke={favItins.includes(itin.id) ? '#e8510a' : '#888'}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-white font-medium text-base">{itin.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">{itin.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  <span className="px-2 py-1 rounded-full border border-gray-200">
                    {itin.duration}
                  </span>
                  <span className="px-2 py-1 rounded-full border border-gray-200">
                    {itin.stops} {t('itineraries.stops')}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full"
                    style={{
                      background: ITINERARY_DIFFICULTY_COLORS[itin.difficulty],
                      color: 'white',
                    }}
                  >
                    {t(`itineraries.${itin.difficulty}`)}
                  </span>
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {t('pages.experiences.includes_label')}:
                  </span>{' '}
                  {stops.join(', ')}
                </div>
                <button
                  onClick={() => navigate(`/map`)}
                  className="btn-primary w-full justify-center text-sm py-2.5"
                  style={{ background: itin.color }}
                >
                  {t('pages.experiences.start_action')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <FAB />
    </div>
  )
}
