export const PLACE_CATEGORIES = ['cultural', 'gastronomy', 'nature', 'accommodation']

export const PLACE_CATEGORY_COLORS = {
  cultural: '#2563eb',
  nature: '#16a34a',
  gastronomy: '#d97706',
  accommodation: '#7F77DD',
}

export const ITINERARY_DIFFICULTIES = ['easy', 'medium', 'hard']

export const ITINERARY_DIFFICULTY_COLORS = {
  easy: '#16a34a',
  medium: '#d97706',
  hard: '#c0392b',
}

export function isPlaceCategory(value) {
  return PLACE_CATEGORIES.includes(value)
}

export function isItineraryDifficulty(value) {
  return ITINERARY_DIFFICULTIES.includes(value)
}
