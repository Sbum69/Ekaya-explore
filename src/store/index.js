import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { idbStorage, migrateFromLocalStorage } from '../services/idbStorage'
import { PLACES } from '../services/data'
import {
  XP_REWARDS,
  claimQuestForCycle,
  grantXpWithCaps,
  recordActivity,
} from '../services/gamification'

migrateFromLocalStorage()

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) =>
        set((state) => ({
          user: user
            ? { ...user, joinedAt: state.user?.joinedAt ?? new Date().toISOString() }
            : null,
        })),
      logout: () => set({ user: null }),

      // Preferences
      notificationsEnabled: true,
      setNotificationsEnabled: (val) => set({ notificationsEnabled: val }),

      // Language
      lang: 'pt',
      languageSwitched: false,
      setLang: (lang) =>
        set((state) => {
          const switchedNow = !state.languageSwitched && lang !== state.lang
          const xpUpdate = switchedNow
            ? grantXpWithCaps(state, {
                rewardKey: 'firstLanguageSwitch',
                amount: XP_REWARDS.firstLanguageSwitch,
              })
            : null
          return {
            lang,
            languageSwitched: state.languageSwitched || lang !== state.lang,
            xp: xpUpdate?.xp ?? state.xp,
            xpDailyLedger: xpUpdate?.xpDailyLedger ?? state.xpDailyLedger,
            rewardFeed: xpUpdate?.rewardFeed ?? state.rewardFeed,
          }
        }),

      // Offline
      isOffline: !navigator.onLine,
      seenOffline: false,
      setOffline: (val) =>
        set((state) => {
          const firstOffline = !state.seenOffline && val === true
          const xpUpdate = firstOffline
            ? grantXpWithCaps(state, {
                rewardKey: 'firstOfflineUse',
                amount: XP_REWARDS.firstOfflineUse,
              })
            : null
          return {
            isOffline: val,
            seenOffline: state.seenOffline || val === true,
            xp: xpUpdate?.xp ?? state.xp,
            xpDailyLedger: xpUpdate?.xpDailyLedger ?? state.xpDailyLedger,
            rewardFeed: xpUpdate?.rewardFeed ?? state.rewardFeed,
          }
        }),

      // Favourites
      favouritePlaces: [],
      favouriteItineraries: [],
      toggleFavouritePlace: (placeId) =>
        set((state) => {
          const adding = !state.favouritePlaces.includes(placeId)
          const now = Date.now()
          const xpUpdate = adding
            ? grantXpWithCaps(state, {
                rewardKey: 'addFavouritePlace',
                amount: XP_REWARDS.addFavouritePlace,
                now,
              })
            : null
          const nextActivity = adding ? recordActivity(state, 'addFavouritePlace', now) : null
          return {
            favouritePlaces: adding
              ? [...state.favouritePlaces, placeId]
              : state.favouritePlaces.filter((id) => id !== placeId),
            xp: xpUpdate?.xp ?? state.xp,
            xpDailyLedger: xpUpdate?.xpDailyLedger ?? state.xpDailyLedger,
            rewardFeed: xpUpdate?.rewardFeed ?? state.rewardFeed,
            activityLedger: nextActivity ?? state.activityLedger,
          }
        }),
      toggleFavouriteItinerary: (itinId) =>
        set((state) => {
          const adding = !state.favouriteItineraries.includes(itinId)
          const now = Date.now()
          const xpUpdate = adding
            ? grantXpWithCaps(state, {
                rewardKey: 'addFavouriteItinerary',
                amount: XP_REWARDS.addFavouriteItinerary,
                now,
              })
            : null
          const nextActivity = adding ? recordActivity(state, 'addFavouriteItinerary', now) : null
          return {
            favouriteItineraries: adding
              ? [...state.favouriteItineraries, itinId]
              : state.favouriteItineraries.filter((id) => id !== itinId),
            xp: xpUpdate?.xp ?? state.xp,
            xpDailyLedger: xpUpdate?.xpDailyLedger ?? state.xpDailyLedger,
            rewardFeed: xpUpdate?.rewardFeed ?? state.rewardFeed,
            activityLedger: nextActivity ?? state.activityLedger,
          }
        }),
      isFavouritePlace: (placeId) => get().favouritePlaces.includes(placeId),

      // Notifications
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      // Social impact support
      socialSupportProjects: [],
      supportLocalProject: (projectId) =>
        set((state) => {
          if (!projectId || state.socialSupportProjects.includes(projectId)) return {}
          const now = Date.now()
          const xpUpdate = grantXpWithCaps(state, {
            rewardKey: 'communitySupport',
            amount: XP_REWARDS.communitySupport,
            now,
          })
          const nextActivity = recordActivity(state, 'communitySupport', now)
          return {
            socialSupportProjects: [...state.socialSupportProjects, projectId],
            xp: xpUpdate.xp,
            xpDailyLedger: xpUpdate.xpDailyLedger,
            rewardFeed: xpUpdate.rewardFeed,
            activityLedger: nextActivity,
          }
        }),

      // Visited places (for badges)
      visitedPlaces: [],
      markVisited: (placeId) =>
        set((state) => {
          if (state.visitedPlaces.includes(placeId)) return {}
          const now = Date.now()
          const place = PLACES.find((item) => item.id === placeId)
          const xpUpdate = grantXpWithCaps(state, {
            rewardKey: 'visitPlace',
            amount: XP_REWARDS.visitPlace,
            now,
          })
          const baseActivity = recordActivity(state, 'visitPlace', now)
          const nextActivity =
            place?.category === 'cultural'
              ? recordActivity({ activityLedger: baseActivity }, 'visitPlace_cultural', now)
              : baseActivity
          return {
            visitedPlaces: [...state.visitedPlaces, placeId],
            xp: xpUpdate.xp,
            xpDailyLedger: xpUpdate.xpDailyLedger,
            rewardFeed: xpUpdate.rewardFeed,
            activityLedger: nextActivity,
          }
        }),

      // Itineraries completed (for badges)
      itinerariesCompleted: [],
      completeItinerary: (itinId) =>
        set((state) => {
          if (state.itinerariesCompleted.includes(itinId)) return {}
          const now = Date.now()
          const xpUpdate = grantXpWithCaps(state, {
            rewardKey: 'completeItinerary',
            amount: XP_REWARDS.completeItinerary,
            now,
          })
          const nextActivity = recordActivity(state, 'completeItinerary', now)
          return {
            itinerariesCompleted: [...state.itinerariesCompleted, itinId],
            xp: xpUpdate.xp,
            xpDailyLedger: xpUpdate.xpDailyLedger,
            rewardFeed: xpUpdate.rewardFeed,
            activityLedger: nextActivity,
          }
        }),

      // Quests + XP
      xp: 0,
      xpDailyLedger: {},
      rewardFeed: [],
      activityLedger: {},
      claimedQuests: [],
      claimedQuestCycles: {},
      claimQuest: (questId, rewardXp, cadence, cycleKey) =>
        set((state) => {
          if (!questId || !cadence || !cycleKey) return {}
          const nextClaims = claimQuestForCycle(
            state.claimedQuestCycles || {},
            questId,
            cadence,
            cycleKey,
          )
          if (nextClaims === state.claimedQuestCycles) return {}

          const xpUpdate = grantXpWithCaps(state, {
            rewardKey: 'claimQuest',
            amount: rewardXp,
            feedType: 'quest',
          })

          return {
            claimedQuestCycles: nextClaims,
            xp: xpUpdate.xp,
            xpDailyLedger: xpUpdate.xpDailyLedger,
            rewardFeed: xpUpdate.rewardFeed,
          }
        }),

      // Streak tracking
      lastActiveDate: null,
      streakDays: 0,
      recordActiveDay: () => {
        const today = new Date().toISOString().slice(0, 10)
        const last = get().lastActiveDate
        if (last === today) return
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        const nextStreak = last === yesterday ? (get().streakDays || 0) + 1 : 1
        set((state) => {
          const now = Date.now()
          const xpUpdate = grantXpWithCaps(state, {
            rewardKey: 'activeDay',
            amount: XP_REWARDS.activeDay,
            now,
          })
          const nextActivity = recordActivity(state, 'activeDay', now)
          return {
            lastActiveDate: today,
            streakDays: nextStreak,
            xp: xpUpdate.xp,
            xpDailyLedger: xpUpdate.xpDailyLedger,
            rewardFeed: xpUpdate.rewardFeed,
            activityLedger: nextActivity,
          }
        })
      },
    }),
    {
      name: 'ekaya-store',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        user: state.user,
        lang: state.lang,
        languageSwitched: state.languageSwitched,
        seenOffline: state.seenOffline,
        notificationsEnabled: state.notificationsEnabled,
        socialSupportProjects: state.socialSupportProjects,
        favouritePlaces: state.favouritePlaces,
        favouriteItineraries: state.favouriteItineraries,
        visitedPlaces: state.visitedPlaces,
        itinerariesCompleted: state.itinerariesCompleted,
        xp: state.xp,
        xpDailyLedger: state.xpDailyLedger,
        rewardFeed: state.rewardFeed,
        activityLedger: state.activityLedger,
        claimedQuests: state.claimedQuests,
        claimedQuestCycles: state.claimedQuestCycles,
        lastActiveDate: state.lastActiveDate,
        streakDays: state.streakDays,
      }),
    },
  ),
)
