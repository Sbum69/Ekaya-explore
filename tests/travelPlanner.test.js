import { describe, expect, it } from 'vitest'
import {
  buildPackingChecklist,
  estimateTripBudget,
  getSeasonForMonth,
} from '../src/services/travelPlanner'

describe('travelPlanner', () => {
  it('estimates budget in metical with safe defaults', () => {
    const plan = estimateTripBudget({ days: 5, travellers: 2, style: 'budget' })

    expect(plan.days).toBe(5)
    expect(plan.travellers).toBe(2)
    expect(plan.perDay).toBeGreaterThan(0)
    expect(plan.total).toBe(plan.perDay * 10)
    expect(plan.breakdown.accommodation).toBeGreaterThan(0)
  })

  it('falls back to comfort style when unknown style is provided', () => {
    const plan = estimateTripBudget({ style: 'unknown' })
    expect(plan.style).toBe('comfort')
  })

  it('returns rainy and dry season according to month', () => {
    expect(getSeasonForMonth(1)).toBe('rainy')
    expect(getSeasonForMonth(8)).toBe('dry')
  })

  it('includes season-sensitive packing suggestions', () => {
    const rainyChecklist = buildPackingChecklist(12)
    const dryChecklist = buildPackingChecklist(7)

    expect(rainyChecklist.join(' ')).toMatch(/chuva|impermeável|repelente/i)
    expect(dryChecklist.join(' ')).toMatch(/chapéu|garrafa|noites/i)
  })
})
