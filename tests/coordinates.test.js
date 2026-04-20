import { describe, expect, it } from 'vitest'
import { PLACES } from '../src/services/data'

const ALLOWED_ZONES = [
  { name: 'Ilha (Stone Town)', lat: -15.0345, lng: 40.734, maxKm: 1.4 },
  { name: 'Ilha (Macuti Sul)', lat: -15.0405, lng: 40.7327, maxKm: 1.1 },
  { name: 'Cabaceira/Mossuril', lat: -15.008, lng: 40.7665, maxKm: 3.8 },
]

function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

describe('place coordinates quality', () => {
  it('keeps all places in allowed tourism areas (Ilha + Cabaceira/Mossuril)', () => {
    for (const place of PLACES) {
      const nearest = ALLOWED_ZONES.map((zone) => ({
        zone,
        km: distanceKm(zone, { lat: place.lat, lng: place.lng }),
      })).sort((a, b) => a.km - b.km)[0]

      expect(
        nearest.km <= nearest.zone.maxKm,
        `${place.name} (${place.lat}, ${place.lng}) is ${nearest.km.toFixed(2)}km from ${nearest.zone.name} (max ${nearest.zone.maxKm}km)`,
      ).toBe(true)
    }
  })

  it('uses valid coordinate ranges', () => {
    for (const place of PLACES) {
      expect(Number.isFinite(place.lat), `${place.name}: lat should be a finite number`).toBe(true)
      expect(Number.isFinite(place.lng), `${place.name}: lng should be a finite number`).toBe(true)
      expect(place.lat).toBeGreaterThanOrEqual(-90)
      expect(place.lat).toBeLessThanOrEqual(90)
      expect(place.lng).toBeGreaterThanOrEqual(-180)
      expect(place.lng).toBeLessThanOrEqual(180)
    }
  })
})
