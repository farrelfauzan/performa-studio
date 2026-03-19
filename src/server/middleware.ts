import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

/**
 * Auth middleware that reads the access token from the cookie
 * and provides it as context to downstream server functions.
 */
export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const accessToken = getCookie('accessToken')

    return next({
      context: {
        accessToken: accessToken ?? null,
      },
    })
  },
)
