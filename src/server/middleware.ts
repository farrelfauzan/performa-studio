import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

/**
 * Auth middleware that reads the access token from the cookie
 * and provides it as context to downstream server functions.
 */
export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    let accessToken: string | null = null

    const tokensStr = getCookie('auth_tokens')
    if (tokensStr) {
      try {
        const tokens = JSON.parse(tokensStr)
        accessToken = tokens.accessToken ?? null
      } catch {
        // ignore malformed cookie
      }
    }

    return next({
      context: {
        accessToken,
      },
    })
  },
)
