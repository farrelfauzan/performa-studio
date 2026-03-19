import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionUser } from '@/server/auth'

type AuthState = {
  accessToken: string | null
  user: SessionUser | null
  setAuth: (accessToken: string, user: SessionUser) => void
  setUser: (user: SessionUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'performa-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
)
