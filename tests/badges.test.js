import { describe, it, expect } from 'vitest'
import { computeBadges, countUnlocked } from '../src/services/badges'
import { PLACES } from '../src/services/data'

const baseState = {
  visitedPlaces: [],
  favouritePlaces: [],
  favouriteItineraries: [],
  itinerariesCompleted: [],
  seenOffline: false,
  languageSwitched: false,
  streakDays: 0,
}

describe('badges', () => {
  it('locks every badge for a fresh user', () => {
    const result = computeBadges(baseState)
    expect(result).toHaveLength(12)
    expect(result.every((b) => !b.unlocked)).toBe(true)
    expect(countUnlocked(baseState)).toBe(0)
  })

  it('unlocks b1 after the first visit', () => {
    const state = { ...baseState, visitedPlaces: [PLACES[0].id] }
    const b1 = computeBadges(state).find((b) => b.id === 'b1')
    expect(b1.unlocked).toBe(true)
  })

  it('unlocks b5 only after every UNESCO place is visited', () => {
    const unescoIds = PLACES.filter((p) => p.tags?.includes('UNESCO')).map((p) => p.id)
    const partial = { ...baseState, visitedPlaces: [unescoIds[0]] }
    const full = { ...baseState, visitedPlaces: unescoIds }
    expect(computeBadges(partial).find((b) => b.id === 'b5').unlocked).toBe(false)
    expect(computeBadges(full).find((b) => b.id === 'b5').unlocked).toBe(true)
  })

  it('unlocks streak badge at 3 days', () => {
    expect(
      computeBadges({ ...baseState, streakDays: 2 }).find((b) => b.id === 'b11').unlocked,
    ).toBe(false)
    expect(
      computeBadges({ ...baseState, streakDays: 3 }).find((b) => b.id === 'b11').unlocked,
    ).toBe(true)
  })
})
