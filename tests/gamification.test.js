import { describe, expect, it } from 'vitest'
import {
  computeQuests,
  getIsoWeekKey,
  getLevelFromXp,
  getLevelProgress,
  grantXpWithCaps,
} from '../src/services/gamification'

const baseState = {
  xp: 0,
  xpDailyLedger: {},
  rewardFeed: [],
  visitedPlaces: [],
  favouritePlaces: [],
  favouriteItineraries: [],
  itinerariesCompleted: [],
  streakDays: 0,
  claimedQuests: [],
  claimedQuestCycles: {},
  socialSupportProjects: [],
}

describe('gamification', () => {
  it('computes level and progress from xp', () => {
    expect(getLevelFromXp(0)).toBe(1)
    expect(getLevelFromXp(99)).toBe(1)
    expect(getLevelFromXp(100)).toBe(2)
    expect(getLevelProgress(250)).toEqual({ current: 50, target: 100, pct: 50 })
  })

  it('applies daily quest claim state per cycle key', () => {
    const state = {
      ...baseState,
      activityLedger: {
        daily: {
          '2026-04-16': {
            visitPlace_cultural: 2,
            addFavouritePlace: 2,
            addFavouriteItinerary: 2,
          },
        },
        weekly: {
          '2026-W16': {
            completeItinerary: 1,
            activeDay: 3,
          },
        },
      },
      claimedQuestCycles: {
        'daily:2026-04-16': ['q1'],
      },
    }
    const quests = computeQuests(state, new Date('2026-04-16T10:00:00Z').getTime())
    const q1 = quests.find((q) => q.id === 'q1')
    const q2 = quests.find((q) => q.id === 'q2')
    expect(q1.claimed).toBe(true)
    expect(q1.claimable).toBe(false)
    expect(q2.claimable).toBe(true)

    const tomorrowQuests = computeQuests(state, new Date('2026-04-17T10:00:00Z').getTime())
    expect(tomorrowQuests.find((q) => q.id === 'q1').claimed).toBe(false)
  })

  it('computes stable ISO week keys across week boundaries', () => {
    const sunday = getIsoWeekKey(new Date('2026-04-19T10:00:00Z').getTime())
    const monday = getIsoWeekKey(new Date('2026-04-20T10:00:00Z').getTime())
    expect(sunday).not.toBe(monday)
  })

  it('tracks community impact quest by weekly support actions', () => {
    const week = getIsoWeekKey(new Date('2026-04-16T10:00:00Z').getTime())
    const state = {
      ...baseState,
      activityLedger: {
        daily: {},
        weekly: {
          [week]: { communitySupport: 2 },
        },
      },
    }
    const quests = computeQuests(state, new Date('2026-04-16T10:00:00Z').getTime())
    const q5 = quests.find((q) => q.id === 'q5')
    expect(q5.completed).toBe(true)
    expect(q5.claimable).toBe(true)

    const nextWeekQuests = computeQuests(state, new Date('2026-04-27T10:00:00Z').getTime())
    expect(nextWeekQuests.find((q) => q.id === 'q5').current).toBe(0)
  })

  it('caps repeatable XP events by day and keeps feed unchanged when capped', () => {
    let state = { ...baseState }
    for (let i = 0; i < 5; i += 1) {
      const update = grantXpWithCaps(state, {
        rewardKey: 'visitPlace',
        amount: 20,
        now: new Date('2026-04-16T09:00:00Z').getTime(),
      })
      state = { ...state, ...update }
    }
    expect(state.xp).toBe(100)
    expect(state.rewardFeed).toHaveLength(5)

    const cappedUpdate = grantXpWithCaps(state, {
      rewardKey: 'visitPlace',
      amount: 20,
      now: new Date('2026-04-16T11:00:00Z').getTime(),
    })
    expect(cappedUpdate.capped).toBe(true)
    expect(cappedUpdate.gainedXp).toBe(0)
    expect(cappedUpdate.xp).toBe(100)
    expect(cappedUpdate.rewardFeed).toHaveLength(5)

    const nextDayUpdate = grantXpWithCaps(state, {
      rewardKey: 'visitPlace',
      amount: 20,
      now: new Date('2026-04-17T11:00:00Z').getTime(),
    })
    expect(nextDayUpdate.capped).toBe(false)
    expect(nextDayUpdate.xp).toBe(120)
  })
})
