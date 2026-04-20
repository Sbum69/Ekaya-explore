import { PLACES } from './data'

export const XP_PER_LEVEL = 100

export const XP_REWARDS = {
  visitPlace: 20,
  completeItinerary: 30,
  addFavouritePlace: 5,
  addFavouriteItinerary: 7,
  activeDay: 10,
  firstLanguageSwitch: 5,
  firstOfflineUse: 5,
  communitySupport: 15,
  claimQuest: 0,
}

export const XP_DAILY_CAPS = {
  visitPlace: 5,
  completeItinerary: 2,
  addFavouritePlace: 4,
  addFavouriteItinerary: 3,
  activeDay: 1,
  firstLanguageSwitch: 1,
  firstOfflineUse: 1,
  communitySupport: 3,
  claimQuest: 8,
}

const QUEST_CADENCE = {
  daily: 'daily',
  weekly: 'weekly',
}

const ACTIVITY_CADENCE = {
  [QUEST_CADENCE.daily]: 'daily',
  [QUEST_CADENCE.weekly]: 'weekly',
}

export const QUESTS = [
  {
    id: 'q1',
    titleKey: 'pages.achievements.quests.q1_title',
    descKey: 'pages.achievements.quests.q1_desc',
    rewardXp: 40,
    target: 2,
    cadence: QUEST_CADENCE.daily,
    activityKeys: ['visitPlace_cultural'],
    getCurrent: (s, ctx) =>
      getActivityCount(s, 'visitPlace_cultural', QUEST_CADENCE.daily, ctx.cycleKey),
  },
  {
    id: 'q2',
    titleKey: 'pages.achievements.quests.q2_title',
    descKey: 'pages.achievements.quests.q2_desc',
    rewardXp: 50,
    target: 1,
    cadence: QUEST_CADENCE.weekly,
    activityKeys: ['completeItinerary'],
    getCurrent: (s, ctx) =>
      getActivityCount(s, 'completeItinerary', QUEST_CADENCE.weekly, ctx.cycleKey),
  },
  {
    id: 'q3',
    titleKey: 'pages.achievements.quests.q3_title',
    descKey: 'pages.achievements.quests.q3_desc',
    rewardXp: 35,
    target: 4,
    cadence: QUEST_CADENCE.daily,
    activityKeys: ['addFavouritePlace', 'addFavouriteItinerary'],
    getCurrent: (s, ctx) =>
      getActivityCount(s, 'addFavouritePlace', QUEST_CADENCE.daily, ctx.cycleKey) +
      getActivityCount(s, 'addFavouriteItinerary', QUEST_CADENCE.daily, ctx.cycleKey),
  },
  {
    id: 'q4',
    titleKey: 'pages.achievements.quests.q4_title',
    descKey: 'pages.achievements.quests.q4_desc',
    rewardXp: 45,
    target: 3,
    cadence: QUEST_CADENCE.weekly,
    activityKeys: ['activeDay'],
    getCurrent: (s, ctx) => getActivityCount(s, 'activeDay', QUEST_CADENCE.weekly, ctx.cycleKey),
  },
  {
    id: 'q5',
    titleKey: 'pages.achievements.quests.q5_title',
    descKey: 'pages.achievements.quests.q5_desc',
    rewardXp: 60,
    target: 2,
    cadence: QUEST_CADENCE.weekly,
    activityKeys: ['communitySupport'],
    getCurrent: (s, ctx) =>
      getActivityCount(s, 'communitySupport', QUEST_CADENCE.weekly, ctx.cycleKey),
  },
]

export function getLevelFromXp(xp) {
  return Math.floor((xp || 0) / XP_PER_LEVEL) + 1
}

export function getLevelProgress(xp) {
  const safeXp = Math.max(0, xp || 0)
  const current = safeXp % XP_PER_LEVEL
  const target = XP_PER_LEVEL
  const pct = Math.round((current / target) * 100)
  return { current, target, pct }
}

export function getIsoDayKey(timestamp = Date.now()) {
  return new Date(timestamp).toISOString().slice(0, 10)
}

export function getIsoWeekKey(timestamp = Date.now()) {
  const date = new Date(timestamp)
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayNum = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7)
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function getQuestCycleKeys(now = Date.now()) {
  return {
    [QUEST_CADENCE.daily]: getIsoDayKey(now),
    [QUEST_CADENCE.weekly]: getIsoWeekKey(now),
  }
}

function legacyActivityCount(state, rewardKey) {
  if (rewardKey === 'visitPlace') {
    return state.visitedPlaces.length
  }
  if (rewardKey === 'visitPlace_cultural') {
    return state.visitedPlaces.filter(
      (id) => PLACES.find((p) => p.id === id)?.category === 'cultural',
    ).length
  }
  if (rewardKey === 'completeItinerary') return state.itinerariesCompleted.length
  if (rewardKey === 'addFavouritePlace') return state.favouritePlaces.length
  if (rewardKey === 'addFavouriteItinerary') return state.favouriteItineraries.length
  if (rewardKey === 'activeDay') return state.streakDays ?? 0
  if (rewardKey === 'communitySupport') return state.socialSupportProjects?.length || 0
  return 0
}

export function getActivityCount(state, rewardKey, cadence, cycleKey) {
  const scope = ACTIVITY_CADENCE[cadence]
  const fromLedger = Number(state.activityLedger?.[scope]?.[cycleKey]?.[rewardKey] || 0)
  if (fromLedger > 0) return fromLedger
  return legacyActivityCount(state, rewardKey)
}

export function recordActivity(state, rewardKey, now = Date.now()) {
  const cycleKeys = getQuestCycleKeys(now)
  const nextLedger = {
    daily: { ...(state.activityLedger?.daily || {}) },
    weekly: { ...(state.activityLedger?.weekly || {}) },
  }
  for (const cadence of [QUEST_CADENCE.daily, QUEST_CADENCE.weekly]) {
    const scope = ACTIVITY_CADENCE[cadence]
    const cycleKey = cycleKeys[cadence]
    const cycleData = nextLedger[scope][cycleKey] || {}
    const current = Number(cycleData[rewardKey] || 0)
    nextLedger[scope][cycleKey] = { ...cycleData, [rewardKey]: current + 1 }
  }
  return nextLedger
}

function questClaimKey(cadence, cycleKey) {
  return `${cadence}:${cycleKey}`
}

function normalizeLegacyClaimed(claimedQuests = []) {
  if (!Array.isArray(claimedQuests)) return {}
  if (claimedQuests.length === 0) return {}
  return { legacy: claimedQuests }
}

export function getClaimedQuestsForCycle(state, cadence, cycleKey) {
  const claimedQuestCycles = state.claimedQuestCycles || normalizeLegacyClaimed(state.claimedQuests)
  if (claimedQuestCycles.legacy) return new Set(claimedQuestCycles.legacy)
  const key = questClaimKey(cadence, cycleKey)
  const claimed = claimedQuestCycles[key]
  return new Set(Array.isArray(claimed) ? claimed : [])
}

export function claimQuestForCycle(claimedQuestCycles = {}, questId, cadence, cycleKey) {
  const key = questClaimKey(cadence, cycleKey)
  const existing = Array.isArray(claimedQuestCycles[key]) ? claimedQuestCycles[key] : []
  if (existing.includes(questId)) return claimedQuestCycles
  return {
    ...claimedQuestCycles,
    [key]: [...existing, questId],
  }
}

function cappedCountForAction(xpDailyLedger, dayKey, rewardKey) {
  return Number(xpDailyLedger?.[dayKey]?.[rewardKey] || 0)
}

function pushRewardFeedEntry(rewardFeed, entry) {
  return [entry, ...(Array.isArray(rewardFeed) ? rewardFeed : [])].slice(0, 12)
}

export function grantXpWithCaps(state, { rewardKey, amount, now = Date.now(), feedType = 'xp' }) {
  const safeAmount = Math.max(0, Number(amount) || 0)
  const safeKey = rewardKey || 'unknown'
  if (!safeAmount) {
    return {
      gainedXp: 0,
      capped: false,
      xp: state.xp || 0,
      xpDailyLedger: state.xpDailyLedger || {},
      rewardFeed: state.rewardFeed || [],
    }
  }

  const dayKey = getIsoDayKey(now)
  const cap = XP_DAILY_CAPS[safeKey]
  const currentCount = cappedCountForAction(state.xpDailyLedger, dayKey, safeKey)
  const capped = Number.isFinite(cap) ? currentCount >= cap : false
  if (capped) {
    return {
      gainedXp: 0,
      capped: true,
      xp: state.xp || 0,
      xpDailyLedger: state.xpDailyLedger || {},
      rewardFeed: state.rewardFeed || [],
    }
  }

  const dayLedger = state.xpDailyLedger?.[dayKey] || {}
  const nextXpDailyLedger = {
    ...(state.xpDailyLedger || {}),
    [dayKey]: {
      ...dayLedger,
      [safeKey]: currentCount + 1,
    },
  }

  const feedEntry = {
    id: `${safeKey}:${now}:${Math.random().toString(36).slice(2, 7)}`,
    type: feedType,
    rewardKey: safeKey,
    xp: safeAmount,
    createdAt: now,
  }

  return {
    gainedXp: safeAmount,
    capped: false,
    xp: (state.xp || 0) + safeAmount,
    xpDailyLedger: nextXpDailyLedger,
    rewardFeed: pushRewardFeedEntry(state.rewardFeed, feedEntry),
  }
}

export function computeQuests(state, now = Date.now()) {
  const cycleKeys = getQuestCycleKeys(now)
  return QUESTS.map((quest) => {
    const cycleKey = cycleKeys[quest.cadence]
    const claimed = getClaimedQuestsForCycle(state, quest.cadence, cycleKey)
    const current = Math.min(quest.target, quest.getCurrent(state, { cycleKey, now }))
    const completed = current >= quest.target
    const isClaimed = claimed.has(quest.id)
    return {
      ...quest,
      cycleKey,
      current,
      completed,
      claimed: isClaimed,
      claimable: completed && !isClaimed,
    }
  })
}
