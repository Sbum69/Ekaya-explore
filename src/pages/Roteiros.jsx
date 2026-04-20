import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ITINERARIES, PLACES } from '../services/data'
import { useStore } from '../store'
import { ITINERARY_DIFFICULTY_COLORS } from '../domain/tourism'
import KpiTile from '../components/ui/KpiTile'

export default function Roteiros() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toggleFav = useStore((s) => s.toggleFavouriteItinerary)
  const favs = useStore((s) => s.favouriteItineraries)
  const completed = useStore((s) => s.itinerariesCompleted)
  const completeItinerary = useStore((s) => s.completeItinerary)

  const totalRoutes = ITINERARIES.length
  const totalStops = ITINERARIES.reduce((sum, item) => sum + item.stops, 0)
  const averageDuration = `${Math.round(ITINERARIES.reduce((sum, item) => sum + Number(item.duration.replace('h', '')), 0) / totalRoutes)}h`

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-xl font-medium text-gray-900">{t('itineraries.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('itineraries.subtitle')}</p>
      </div>

      <div className="px-4 grid gap-3 sm:grid-cols-3 mb-4">
        <KpiTile value={totalRoutes} label={t('pages.routes.stats_routes')} />
        <KpiTile value={totalStops} label={t('pages.routes.stats_stops')} />
        <KpiTile value={averageDuration} label={t('pages.routes.stats_avg_duration')} />
      </div>

      <div className="px-4 flex flex-col gap-4">
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
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className="text-white text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: ITINERARY_DIFFICULTY_COLORS[itin.difficulty] }}
                  >
                    {t(`itineraries.${itin.difficulty}`)}
                  </span>
                </div>
                <button
                  onClick={() => toggleFav(itin.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center border-0 cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={favs.includes(itin.id) ? '#e8510a' : 'none'}
                    stroke={favs.includes(itin.id) ? '#e8510a' : '#555'}
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-3">
                  <h2 className="text-white font-medium text-base">{itin.title}</h2>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">{itin.description}</p>
                <div className="grid gap-2 sm:grid-cols-3 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('itineraries.duration')}:</span>{' '}
                    {itin.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('itineraries.stops')}:</span> {itin.stops}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('itineraries.difficulty')}:</span>{' '}
                    {t(`itineraries.${itin.difficulty}`)}
                  </div>
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {t('pages.routes.highlights_label')}:
                  </span>{' '}
                  {stops.join(', ')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/map')}
                    className="btn-primary flex-1 justify-center text-sm"
                  >
                    {t('itineraries.start')}
                  </button>
                  <button
                    onClick={() => completeItinerary(itin.id)}
                    disabled={completed.includes(itin.id)}
                    className={`px-4 py-2.5 rounded-full text-sm border transition ${
                      completed.includes(itin.id)
                        ? 'bg-ekaya-orange-light text-ekaya-orange border-ekaya-orange cursor-default'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-ekaya-orange'
                    }`}
                  >
                    {completed.includes(itin.id)
                      ? t('pages.routes.done')
                      : t('pages.routes.mark_done')}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
