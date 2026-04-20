import { describe, expect, it } from 'vitest'
import { ARTICLES, ITINERARIES, PLACES } from '../src/services/data'

const HTTP_URL = /^https?:\/\/.+/

describe('content lint', () => {
  it('keeps place cards content complete and bounded', () => {
    for (const place of PLACES) {
      expect(place.name?.trim().length, `${place.id}: place name too short`).toBeGreaterThanOrEqual(
        3,
      )
      expect(place.name.length, `${place.id}: place name too long`).toBeLessThanOrEqual(80)
      expect(
        place.description?.trim().length,
        `${place.name}: description too short`,
      ).toBeGreaterThanOrEqual(30)
      expect(place.description.length, `${place.name}: description too long`).toBeLessThanOrEqual(
        260,
      )
      expect(Array.isArray(place.tags), `${place.name}: tags must be an array`).toBe(true)
      expect(place.tags.length, `${place.name}: at least 2 tags required`).toBeGreaterThanOrEqual(2)
      expect(HTTP_URL.test(place.image), `${place.name}: image must be an absolute url`).toBe(true)
    }
  })

  it('keeps itinerary metadata realistic and readable', () => {
    for (const itinerary of ITINERARIES) {
      expect(
        itinerary.title?.trim().length,
        `${itinerary.id}: title too short`,
      ).toBeGreaterThanOrEqual(5)
      expect(itinerary.title.length, `${itinerary.id}: title too long`).toBeLessThanOrEqual(90)
      expect(
        itinerary.description?.trim().length,
        `${itinerary.title}: description too short`,
      ).toBeGreaterThanOrEqual(20)
      expect(
        itinerary.description.length,
        `${itinerary.title}: description too long`,
      ).toBeLessThanOrEqual(220)
      expect(
        /^(\d+)h$/.test(itinerary.duration),
        `${itinerary.title}: duration should be like 4h`,
      ).toBe(true)
      expect(
        HTTP_URL.test(itinerary.image),
        `${itinerary.title}: image must be an absolute url`,
      ).toBe(true)
    }
  })

  it('keeps article metadata and sections present', () => {
    for (const article of ARTICLES) {
      expect(
        article.title?.trim().length,
        `${article.id}: article title too short`,
      ).toBeGreaterThanOrEqual(8)
      expect(
        article.excerpt?.trim().length,
        `${article.id}: excerpt too short`,
      ).toBeGreaterThanOrEqual(40)
      expect(Array.isArray(article.sections), `${article.id}: sections must be an array`).toBe(true)
      expect(
        article.sections.length,
        `${article.id}: article should have at least 2 sections`,
      ).toBeGreaterThanOrEqual(2)
      expect(HTTP_URL.test(article.image), `${article.id}: image must be an absolute url`).toBe(
        true,
      )
    }
  })
})
