import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { useTranslation } from 'react-i18next'
import { PLACES } from '../services/data'
import { useStore } from '../store'
import { PLACE_CATEGORIES, PLACE_CATEGORY_COLORS } from '../domain/tourism'
import KpiTile from '../components/ui/KpiTile'
import { filterPlaces, getHighlights } from '../services/mapDiscovery'

const CATEGORIES = ['all', ...PLACE_CATEGORIES]

function makeIcon(color) {
  return L.divIcon({
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    className: '',
  })
}

function makeClusterIcon(cluster) {
  const count = cluster.getChildCount()
  return L.divIcon({
    html: `<div style="width:40px;height:40px;border-radius:50%;background:#e8510a;color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)">${count}</div>`,
    iconSize: [40, 40],
    className: '',
  })
}

function ClusterLayer({ places, onSelect }) {
  const map = useMap()
  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
      iconCreateFunction: makeClusterIcon,
    })
    for (const p of places) {
      const m = L.marker([p.lat, p.lng], {
        icon: makeIcon(PLACE_CATEGORY_COLORS[p.category] || '#888'),
      })
      m.on('click', () => onSelect(p))
      group.addLayer(m)
    }
    map.addLayer(group)
    return () => {
      map.removeLayer(group)
    }
  }, [map, places, onSelect])
  return null
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="rounded-3xl border border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-500"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
      />
    </label>
  )
}

export default function MapPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const toggleFav = useStore((s) => s.toggleFavouritePlace)
  const isFav = useStore((s) => s.isFavouritePlace)

  const filtered = filterPlaces(PLACES, { category, search })
  const highlights = getHighlights(filtered, 3)
  const totalPlaces = filtered.length

  useEffect(() => {
    if (selected && !filtered.some((place) => place.id === selected.id)) {
      setSelected(null)
    }
  }, [filtered, selected])

  return (
    <div className="min-h-screen bg-ekaya-bg pb-24">
      <div className="mx-4 mt-4 space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[.2em] text-ekaya-orange font-semibold">
                {t('features.map.title')}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">{t('pages.map.title')}</h1>
              <p className="text-sm text-gray-500 mt-2">{t('map.subtitle')}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <KpiTile value={totalPlaces} label={t('pages.map.found')} />
              <KpiTile value={PLACES.length} label={t('pages.map.total')} />
              <button
                onClick={() => navigate('/favoritos')}
                className="rounded-3xl bg-ekaya-orange px-4 py-4 text-sm font-semibold text-white"
              >
                {t('pages.map.view_favourites')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3" role="group" aria-label={t('map.subtitle')}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-3xl border p-4 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ekaya-orange focus-visible:ring-offset-2 ${category === cat ? 'bg-ekaya-orange text-white border-ekaya-orange' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              <div>{t(`map.${cat}`)}</div>
              <div
                className={`text-xs mt-2 ${category === cat ? 'text-white/80' : 'text-gray-500'}`}
              >
                {cat === 'all'
                  ? `${PLACES.length} ${t('pages.map.places_suffix')}`
                  : `${PLACES.filter((p) => p.category === cat).length} ${t('pages.map.places_suffix')}`}
              </div>
            </button>
          ))}
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder={t('map.search')} />
      </div>

      <div className="mx-4 mt-4 rounded-3xl overflow-hidden shadow-sm h-[60vh] relative">
        <MapContainer
          center={[-15.035, 40.734]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClusterLayer places={filtered} onSelect={setSelected} />
        </MapContainer>
        <div className="absolute top-4 left-4 rounded-3xl bg-white/90 p-3 shadow-sm backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[.2em] text-gray-500">
            {t('pages.map.quick_view')}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {t('pages.map.current_filter_count', { count: totalPlaces })}
          </p>
        </div>
      </div>

      <div className="mx-4 mt-4 space-y-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('pages.map.highlights_title')}
              </h2>
              <p className="text-sm text-gray-500">{t('pages.map.highlights_subtitle')}</p>
            </div>
            <button
              onClick={() => setCategory('all')}
              className="text-sm font-semibold text-ekaya-orange"
            >
              {t('pages.map.view_all')}
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {highlights.length > 0 ? (
              highlights.map((place) => (
                <div key={place.id} className="rounded-3xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-900">{place.name}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{place.description}</p>
                  <button
                    onClick={() => navigate(`/place/${place.id}`)}
                    className="mt-4 text-sm font-semibold text-ekaya-orange"
                  >
                    {t('pages.map.view_place')}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">{t('pages.map.no_results')}</p>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-2xl">
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="flex gap-3 px-4 pt-2">
            <img
              src={selected.image}
              alt={selected.name}
              loading="lazy"
              decoding="async"
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900 text-[15px]">{selected.name}</h3>
                <button
                  onClick={() => toggleFav(selected.id)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill={isFav(selected.id) ? '#e8510a' : 'none'}
                    stroke={isFav(selected.id) ? '#e8510a' : '#aaa'}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{selected.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-xs text-gray-500">{selected.rating}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ background: PLACE_CATEGORY_COLORS[selected.category] }}
                >
                  {t(`map.${selected.category}`)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 p-4">
            <button
              onClick={() => navigate(`/place/${selected.id}`)}
              className="btn-primary flex-1 justify-center text-sm py-2.5"
            >
              {t('common.details')}
            </button>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
