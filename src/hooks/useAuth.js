import { useStore } from '../store'

export function useAuth() {
  const user = useStore((s) => s.user)
  const setUser = useStore((s) => s.setUser)
  const logout = useStore((s) => s.logout)
  return { user, isAuthenticated: Boolean(user), setUser, logout }
}
