import { createServerFn } from '@tanstack/react-start'
import {
  getCookie,
  setCookie,
  deleteCookie,
} from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'

// ─── Dummy user database ────────────────────────────────────────────────
const DUMMY_USERS = [
  {
    id: '1',
    email: 'admin@performa.io',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@performa.io',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
  },
] as const

// ─── Types ──────────────────────────────────────────────────────────────
export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
}

// ─── Session helpers (cookie-based, server-only) ────────────────────────
function getSessionFromCookie(): SessionUser | null {
  const raw = getCookie('session')
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

// ─── Server Functions ───────────────────────────────────────────────────

/** Get the current session (returns user or null) */
export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = getSessionFromCookie()
    return user
  },
)

/** Login with email + password */
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      email: z.string(),
      password: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500))

    const user = DUMMY_USERS.find(
      (u) => u.email === data.email && u.password === data.password,
    )

    if (!user) {
      return {
        error: 'Invalid email or password',
        user: null,
      }
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    // Set session cookie (7 days)
    setCookie('session', JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return { error: null, user: sessionUser }
  })

/** Logout — clear session cookie */
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('session')
})

/** Guard: require auth or redirect to login */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = getSessionFromCookie()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return user
  },
)
