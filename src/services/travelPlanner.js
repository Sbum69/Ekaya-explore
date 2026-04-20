const DAILY_BUDGET_MZN = {
  budget: {
    accommodation: 2800,
    food: 900,
    transport: 500,
    activities: 700,
    reserve: 400,
  },
  comfort: {
    accommodation: 5200,
    food: 1400,
    transport: 900,
    activities: 1300,
    reserve: 700,
  },
  premium: {
    accommodation: 9800,
    food: 2600,
    transport: 1500,
    activities: 2600,
    reserve: 1200,
  },
}

const SEASON_BY_MONTH = {
  1: 'rainy',
  2: 'rainy',
  3: 'rainy',
  4: 'dry',
  5: 'dry',
  6: 'dry',
  7: 'dry',
  8: 'dry',
  9: 'dry',
  10: 'dry',
  11: 'rainy',
  12: 'rainy',
}

const SEASONAL_PACKING = {
  rainy: ['capa de chuva leve', 'saco impermeável', 'repelente reforçado'],
  dry: ['chapéu de aba larga', 'garrafa reutilizável', 'camada leve para noites ventosas'],
}

export const PHRASEBOOK = [
  {
    pt: 'Bom dia',
    en: 'Good morning',
    emk: 'Nlamuka',
    useCase: 'cumprimentar moradores e anfitriões',
  },
  {
    pt: 'Obrigado(a)',
    en: 'Thank you',
    emk: 'Koha',
    useCase: 'agradecer em mercados e visitas guiadas',
  },
  {
    pt: 'Quanto custa?',
    en: 'How much is it?',
    emk: 'Ekhavi ni?',
    useCase: 'negociar de forma respeitosa',
  },
  {
    pt: 'Posso tirar uma foto?',
    en: 'May I take a photo?',
    emk: 'Kinoowela opaka foto?',
    useCase: 'pedir consentimento antes de fotografar',
  },
]

export function getSeasonForMonth(month) {
  const season = SEASON_BY_MONTH[Number(month)]
  return season || 'dry'
}

export function buildPackingChecklist(month) {
  const season = getSeasonForMonth(month)
  return [...SEASONAL_PACKING[season], 'protetor solar', 'calçado confortável para caminhada']
}

export function estimateTripBudget({ days = 3, travellers = 1, style = 'comfort' } = {}) {
  const safeDays = Math.max(1, Number(days) || 1)
  const safeTravellers = Math.max(1, Number(travellers) || 1)
  const profile = DAILY_BUDGET_MZN[style] || DAILY_BUDGET_MZN.comfort
  const perDay = Object.values(profile).reduce((sum, val) => sum + val, 0)
  const total = perDay * safeDays * safeTravellers

  return {
    style: DAILY_BUDGET_MZN[style] ? style : 'comfort',
    seasonHint:
      safeDays >= 6 ? 'considerar rota com Ilha + Cabaceiras' : 'foco na Ilha de Moçambique',
    travellers: safeTravellers,
    days: safeDays,
    perDay,
    total,
    breakdown: {
      accommodation: profile.accommodation * safeDays * safeTravellers,
      food: profile.food * safeDays * safeTravellers,
      transport: profile.transport * safeDays * safeTravellers,
      activities: profile.activities * safeDays * safeTravellers,
      reserve: profile.reserve * safeDays * safeTravellers,
    },
  }
}
