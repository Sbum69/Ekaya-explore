import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const pt = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/i18n/pt.json'), 'utf8'))
const en = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/i18n/en.json'), 'utf8'))

const REQUIRED_KEYS = [
  'pages.map.title',
  'pages.map.found',
  'pages.map.total',
  'pages.map.view_favourites',
  'pages.map.places_suffix',
  'pages.map.quick_view',
  'pages.map.current_filter_count',
  'pages.map.highlights_title',
  'pages.map.highlights_subtitle',
  'pages.map.view_all',
  'pages.map.view_place',
  'pages.map.no_results',
  'pages.routes.stats_routes',
  'pages.routes.stats_stops',
  'pages.routes.stats_avg_duration',
  'pages.routes.highlights_label',
  'pages.routes.mark_done',
  'pages.routes.done',
  'pages.experiences.includes_label',
  'pages.experiences.start_action',
  'pages.achievements.level',
  'pages.achievements.quests_title',
  'pages.achievements.quests_claimable',
  'pages.achievements.quest_in_progress',
  'pages.achievements.quest_completed',
  'pages.achievements.quest_claim',
  'pages.achievements.quest_claimed',
  'pages.achievements.quest_locked',
  'pages.achievements.quest_daily',
  'pages.achievements.quest_weekly',
  'pages.achievements.quest_claimable_toast',
  'pages.achievements.quest_claim_toast',
  'pages.achievements.quests.q1_title',
  'pages.achievements.quests.q1_desc',
  'pages.achievements.quests.q2_title',
  'pages.achievements.quests.q2_desc',
  'pages.achievements.quests.q3_title',
  'pages.achievements.quests.q3_desc',
  'pages.achievements.quests.q4_title',
  'pages.achievements.quests.q4_desc',
  'pages.achievements.quests.q5_title',
  'pages.achievements.quests.q5_desc',
  'dashboard.recent_rewards',
  'dashboard.recent_rewards_empty',
  'dashboard.reward_visitPlace',
  'dashboard.reward_completeItinerary',
  'dashboard.reward_addFavouritePlace',
  'dashboard.reward_addFavouriteItinerary',
  'dashboard.reward_activeDay',
  'dashboard.reward_firstLanguageSwitch',
  'dashboard.reward_firstOfflineUse',
  'dashboard.reward_communitySupport',
  'dashboard.reward_claimQuest',
  'dashboard.reward_quest_claim',
  'pages.impact.support_title',
  'pages.impact.support_subtitle',
  'pages.impact.support_artisans',
  'pages.impact.support_restoration',
  'pages.impact.support_education',
  'pages.impact.support_cta',
  'pages.impact.support_done',
]

function pick(obj, dotPath) {
  return dotPath.split('.').reduce((acc, k) => acc?.[k], obj)
}

describe('i18n keys parity (pt/en)', () => {
  it('contains required map/routes/experiences keys in both locales', () => {
    for (const key of REQUIRED_KEYS) {
      expect(pick(pt, key), `Missing key in pt: ${key}`).toBeDefined()
      expect(pick(en, key), `Missing key in en: ${key}`).toBeDefined()
    }
  })
})
