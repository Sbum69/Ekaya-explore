import { describe, it } from 'vitest'
import { contrastRatio } from '../src/tokens/contrast'

const PALETTE = {
  orange: '#e8510a',
  white: '#ffffff',
  bg: '#f5f5f3',
  gray900: '#111827',
  gray700: '#374151',
  gray600: '#4b5563',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray300: '#d1d5db',
}

const CASES = [
  ['gray-900 on white (primary text)', PALETTE.gray900, PALETTE.white],
  ['gray-900 on bg (primary text on page)', PALETTE.gray900, PALETTE.bg],
  ['gray-700 on white (muted text)', PALETTE.gray700, PALETTE.white],
  ['gray-600 on white (secondary text)', PALETTE.gray600, PALETTE.white],
  ['gray-500 on white (subtext)', PALETTE.gray500, PALETTE.white],
  ['gray-500 on bg (subtext on page)', PALETTE.gray500, PALETTE.bg],
  ['gray-400 on white (muted labels)', PALETTE.gray400, PALETTE.white],
  ['orange on white (accent text, buttons)', PALETTE.orange, PALETTE.white],
  ['white on orange (btn-primary)', PALETTE.white, PALETTE.orange],
]

describe('contrast audit — informational report (all cases)', () => {
  for (const [label, a, b] of CASES) {
    const ratio = contrastRatio(a, b).toFixed(2)
    it(`${label}: ${ratio}:1`, () => {})
  }
})
