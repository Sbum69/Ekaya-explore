import { describe, expect, it } from 'vitest'
import { filterPlaces, getHighlights } from '../src/services/mapDiscovery'

const FIXTURES = [
  {
    id: '1',
    name: 'Fortaleza de São Sebastião',
    description: 'Marco histórico na Ilha de Moçambique',
    tags: ['UNESCO', 'Património'],
    category: 'cultural',
    rating: 4.7,
  },
  {
    id: '2',
    name: 'Praia de Cabaceira Grande',
    description: 'Praia para snorkeling e pesca',
    tags: ['Praia', 'Natureza'],
    category: 'nature',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Mercado Municipal',
    description: 'Sabores locais e artesanato',
    tags: ['Gastronomia'],
    category: 'gastronomy',
    rating: 4.3,
  },
]

describe('map discovery', () => {
  it('filters by category and text (accent-insensitive)', () => {
    const categoryFiltered = filterPlaces(FIXTURES, { category: 'nature', search: '' })
    const textFiltered = filterPlaces(FIXTURES, { category: 'all', search: 'MOCAMBIQUE' })

    expect(categoryFiltered).toHaveLength(1)
    expect(categoryFiltered[0].id).toBe('2')
    expect(textFiltered).toHaveLength(1)
    expect(textFiltered[0].id).toBe('1')
  })

  it('matches search against tags and description', () => {
    expect(filterPlaces(FIXTURES, { search: 'snorkeling' }).map((x) => x.id)).toEqual(['2'])
    expect(filterPlaces(FIXTURES, { search: 'artesanato' }).map((x) => x.id)).toEqual(['3'])
  })

  it('returns highlights sorted by rating desc', () => {
    const highlights = getHighlights(FIXTURES, 2)
    expect(highlights.map((item) => item.id)).toEqual(['2', '1'])
  })
})
