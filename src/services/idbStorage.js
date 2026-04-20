import { createStore, get, set, del } from 'idb-keyval'

const idb = createStore('ekaya-db', 'state')

export const idbStorage = {
  getItem: async (name) => {
    const value = await get(name, idb)
    return value ?? null
  },
  setItem: async (name, value) => {
    await set(name, value, idb)
  },
  removeItem: async (name) => {
    await del(name, idb)
  },
}

const LS_KEY = 'ekaya-store'

export async function migrateFromLocalStorage() {
  if (typeof localStorage === 'undefined') return
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return
  const existing = await get(LS_KEY, idb)
  if (existing) return
  try {
    await set(LS_KEY, JSON.parse(raw), idb)
    localStorage.removeItem(LS_KEY)
  } catch {
    // leave localStorage intact if parse fails
  }
}
