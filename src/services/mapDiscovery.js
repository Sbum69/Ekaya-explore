function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function filterPlaces(places, { category = 'all', search = '' } = {}) {
  const query = normalizeText(search).trim()
  return places.filter((place) => {
    const matchCategory = category === 'all' || place.category === category
    if (!matchCategory) return false
    if (!query) return true
    const haystack = [place.name, place.description, ...(place.tags || [])]
      .map(normalizeText)
      .join(' ')
    return haystack.includes(query)
  })
}

export function getHighlights(places, limit = 3) {
  return [...places]
    .sort((a, b) => {
      if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0)
      return (a.name || '').localeCompare(b.name || '')
    })
    .slice(0, limit)
}
