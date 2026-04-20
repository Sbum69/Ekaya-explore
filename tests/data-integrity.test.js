import { describe, expect, it } from 'vitest'
import { ARTICLES, ITINERARIES, NOTIFICATIONS, PLACES, TIMELINE } from '../src/services/data'
import { isItineraryDifficulty, isPlaceCategory, PLACE_CATEGORIES } from '../src/domain/tourism'

function hasUniqueIds(items, label) {
  const ids = items.map((item) => item.id)
  const unique = new Set(ids)
  expect(unique.size, `${label} has duplicate ids`).toBe(ids.length)
}

describe('data integrity', () => {
  it('keeps unique ids across core collections', () => {
    hasUniqueIds(PLACES, 'PLACES')
    hasUniqueIds(ITINERARIES, 'ITINERARIES')
    hasUniqueIds(NOTIFICATIONS, 'NOTIFICATIONS')
    hasUniqueIds(ARTICLES, 'ARTICLES')
    hasUniqueIds(TIMELINE, 'TIMELINE')
  })

  it('uses valid place categories and coordinate values', () => {
    for (const place of PLACES) {
      expect(isPlaceCategory(place.category), `${place.name}: invalid category`).toBe(true)
      expect(Number.isFinite(place.lat), `${place.name}: lat must be finite`).toBe(true)
      expect(Number.isFinite(place.lng), `${place.name}: lng must be finite`).toBe(true)
      expect(place.lat).toBeGreaterThanOrEqual(-90)
      expect(place.lat).toBeLessThanOrEqual(90)
      expect(place.lng).toBeGreaterThanOrEqual(-180)
      expect(place.lng).toBeLessThanOrEqual(180)
    }
  })

  it('keeps itinerary references consistent', () => {
    const placeIds = new Set(PLACES.map((place) => place.id))
    for (const itinerary of ITINERARIES) {
      expect(
        isItineraryDifficulty(itinerary.difficulty),
        `${itinerary.title}: invalid difficulty`,
      ).toBe(true)
      expect(
        Array.isArray(itinerary.placeIds),
        `${itinerary.title}: placeIds must be an array`,
      ).toBe(true)
      expect(
        itinerary.placeIds.length,
        `${itinerary.title}: stops should match placeIds length`,
      ).toBe(itinerary.stops)
      for (const id of itinerary.placeIds) {
        expect(placeIds.has(id), `${itinerary.title}: missing place id ${id}`).toBe(true)
      }
    }
  })

  it('keeps category coverage for tourism discovery', () => {
    const categoriesInData = new Set(PLACES.map((place) => place.category))
    for (const category of PLACE_CATEGORIES) {
      expect(categoriesInData.has(category), `No places found for category "${category}"`).toBe(
        true,
      )
    }
  })
})
