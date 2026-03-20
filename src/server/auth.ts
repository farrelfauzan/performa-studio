import { createServerFn } from '@tanstack/react-start'
import { setCookie, deleteCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { authMiddleware } from './middleware'

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

// ─── Types ──────────────────────────────────────────────────────────────
export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  profilePicture: string | null
}

// ─── Server Functions ───────────────────────────────────────────────────

/** Get the current session by validating token against backend */
export const getSession = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const token = context.accessToken

    if (!token) return null

    try {
      const res = await fetch(`${API_URL}/v1/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) return null

      const json = (await res.json()) as {
        data: {
          id: string
          username: string
          email: string
          roles: { id: string; name: string; permissions: string[] }[]
          fullName: string | null
          profilePicture: string | null
        }
      }

      const profile = json.data
      const sessionUser: SessionUser = {
        id: profile.id,
        email: profile.email,
        name: profile.fullName || profile.username,
        role: profile.roles?.[0]?.name ?? 'user',
        profilePicture: profile.profilePicture ?? null,
      }

      return sessionUser
    } catch {
      return null
    }
  })

/** Login with email + password */
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      email: z.string(),
      password: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: data.email,
          password: data.password,
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => null)
        return {
          error:
            (error as { message?: string })?.message ||
            'Invalid email or password',
          user: null,
          accessToken: null,
        }
      }

      const json = (await res.json()) as {
        data: {
          accessToken: string
          refreshToken: string
          user?: { id: string; username: string; email: string }
        }
      }

      const { accessToken, refreshToken, user: loginUser } = json.data

      // Store tokens in httpOnly cookies (7 days)
      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }

      setCookie('accessToken', accessToken, cookieOpts)
      setCookie('refreshToken', refreshToken, cookieOpts)

      // Fetch full profile
      const profileRes = await fetch(`${API_URL}/v1/auth/getMe`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      let sessionUser: SessionUser
      if (profileRes.ok) {
        const profileJson = (await profileRes.json()) as {
          data: {
            id: string
            username: string
            email: string
            roles: { id: string; name: string; permissions: string[] }[]
            fullName: string | null
          }
        }
        const profile = profileJson.data
        sessionUser = {
          id: profile.id,
          email: profile.email,
          name: profile.fullName || profile.username,
          role: profile.roles?.[0]?.name ?? 'user',
        }
      } else {
        sessionUser = {
          id: loginUser?.id ?? '',
          email: loginUser?.email ?? data.email,
          name: loginUser?.username ?? data.email,
          role: 'user',
        }
      }

      return { error: null, user: sessionUser, accessToken }
    } catch {
      return {
        error: 'An error occurred during login. Please try again.',
        user: null,
        accessToken: null,
      }
    }
  })

/** Logout — clear session cookies */
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('accessToken')
  deleteCookie('refreshToken')
})

/** Request a password reset token for the given email */
export const requestPasswordResetFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      email: z.email({ error: 'Invalid email address' }),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${API_URL}/v1/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => null)
        return {
          error:
            (error as { message?: string })?.message ||
            'Failed to request password reset',
          resetToken: null,
        }
      }

      const json = (await res.json()) as {
        data: { message: string; resetToken: string }
      }

      return { error: null, resetToken: json.data.resetToken }
    } catch {
      return {
        error: 'An error occurred. Please try again.',
        resetToken: null,
      }
    }
  })

/** Reset password using a token */
export const resetPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      token: z.string().min(1),
      newPassword: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${API_URL}/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          newPassword: data.newPassword,
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => null)
        return {
          error:
            (error as { message?: string })?.message ||
            'Failed to reset password',
        }
      }

      return { error: null }
    } catch {
      return {
        error: 'An error occurred. Please try again.',
      }
    }
  })

/** Guard: require auth or redirect to login */
export const requireAuth = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const token = context.accessToken
    if (!token) {
      throw redirect({ to: '/login' })
    }

    try {
      const res = await fetch(`${API_URL}/v1/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw redirect({ to: '/login' })
      }

      const json = (await res.json()) as {
        data: {
          id: string
          username: string
          email: string
          roles: { id: string; name: string; permissions: string[] }[]
          fullName: string | null
        }
      }

      const profile = json.data
      return {
        id: profile.id,
        email: profile.email,
        name: profile.fullName || profile.username,
        role: profile.roles?.[0]?.name ?? 'user',
      } satisfies SessionUser
    } catch (e) {
      if (e && typeof e === 'object' && 'to' in e) throw e // re-throw redirect
      throw redirect({ to: '/login' })
    }
  })
