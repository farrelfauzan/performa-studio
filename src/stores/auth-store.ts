import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  isAuthenticated: boolean
  permissions: {
    action: string
    subject: string
  }[]
  user: any // temporary, replace with actual user type
  logout: () => void
  setAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      permissions: [],
      user: null,
      logout: () =>
        set({ isAuthenticated: false, permissions: [], user: null }),
      setAuth: () =>
        set({
          isAuthenticated: true,
          permissions: [{ action: 'manage', subject: 'all' }],
          user: { name: 'John Doe' },
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
        user: state.user,
      }),
    },
  ),
)
