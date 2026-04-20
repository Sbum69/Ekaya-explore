import { describe, it, expect } from 'vitest'
import { formatBytes } from '../src/hooks/useStorageEstimate'

describe('formatBytes', () => {
  it('returns 0 B for zero/undefined', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(undefined)).toBe('0 B')
  })

  it('formats KB and MB', () => {
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB')
  })

  it('caps at GB for very large values', () => {
    expect(formatBytes(1024 ** 4)).toMatch(/GB$/)
  })
})
