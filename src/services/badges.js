import { BADGES, PLACES } from './data'
import { isPlaceCategory } from '../domain/tourism'

const countByCategory = (visitedIds, category) => {
  if (!isPlaceCategory(category)) return 0
  return visitedIds.filter((id) => PLACES.find((p) => p.id === id)?.category === category).length
}

const unescoPlaceIds = PLACES.filter((p) => p.tags?.includes('UNESCO')).map((p) => p.id)

export const BADGE_GOALS = {
  b1: 'Visita o teu primeiro local',
  b2: 'Visita 3 locais culturais',
  b3: 'Guarda 10 locais favoritos',
  b4: 'Completa um roteiro',
  b5: 'Visita todos os pontos UNESCO',
  b6: 'Abre a app em modo offline',
  b7: 'Experimenta ambos os idiomas',
  b8: 'Visita 2 locais de gastronomia',
  b9: 'Visita 2 locais naturais',
  b10: 'Guarda 3 roteiros favoritos',
  b11: 'Usa a app 3 dias seguidos',
  b12: 'Completa 3 roteiros',
}

const PROGRESS = {
  b1: (s) => ({ current: Math.min(s.visitedPlaces.length, 1), target: 1 }),
  b2: (s) => ({ current: Math.min(countByCategory(s.visitedPlaces, 'cultural'), 3), target: 3 }),
  b3: (s) => ({ current: Math.min(s.favouritePlaces.length, 10), target: 10 }),
  b4: (s) => ({ current: Math.min(s.itinerariesCompleted.length, 1), target: 1 }),
  b5: (s) => ({
    current: unescoPlaceIds.filter((id) => s.visitedPlaces.includes(id)).length,
    target: unescoPlaceIds.length,
  }),
  b6: (s) => ({ current: s.seenOffline ? 1 : 0, target: 1 }),
  b7: (s) => ({ current: s.languageSwitched ? 1 : 0, target: 1 }),
  b8: (s) => ({ current: Math.min(countByCategory(s.visitedPlaces, 'gastronomy'), 2), target: 2 }),
  b9: (s) => ({ current: Math.min(countByCategory(s.visitedPlaces, 'nature'), 2), target: 2 }),
  b10: (s) => ({ current: Math.min(s.favouriteItineraries.length, 3), target: 3 }),
  b11: (s) => ({ current: Math.min(s.streakDays ?? 0, 3), target: 3 }),
  b12: (s) => ({ current: Math.min(s.itinerariesCompleted.length, 3), target: 3 }),
}

export function computeBadges(state) {
  return BADGES.map((b) => {
    const progress = PROGRESS[b.id]?.(state) ?? { current: 0, target: 1 }
    return {
      ...b,
      goal: BADGE_GOALS[b.id],
      progress,
      unlocked: progress.current >= progress.target,
    }
  })
}

export function countUnlocked(state) {
  return computeBadges(state).reduce((n, b) => n + (b.unlocked ? 1 : 0), 0)
}
