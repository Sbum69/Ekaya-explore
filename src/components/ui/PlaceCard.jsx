import { useStore } from '../../store'
import { PLACE_CATEGORY_COLORS } from '../../domain/tourism'

export default function PlaceCard({ place, onClick }) {
  const toggleFav = useStore((s) => s.toggleFavouritePlace)
  const isFav = useStore((s) => s.isFavouritePlace(place.id))
  const color = PLACE_CATEGORY_COLORS[place.category] || '#888'

  return (
    <div
      className="card cursor-pointer hover:-translate-y-0.5 transition-transform"
      onClick={onClick}
    >
      <div className="relative h-40 bg-gray-100">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFav(place.id)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border-0 cursor-pointer"
          aria-label="Favorito"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFav ? '#e8510a' : 'none'}
            stroke={isFav ? '#e8510a' : '#888'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <span
          className="absolute bottom-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: color }}
        >
          {place.category}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm">{place.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{place.description}</p>
        <div className="flex items-center gap-1 mt-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-xs text-gray-500">{place.rating}</span>
        </div>
      </div>
    </div>
  )
}
