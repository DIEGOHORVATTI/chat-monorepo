import { setCookie } from '@orpc/server/helpers'
import { pub, ENV, auth } from '@repo/service-core'
import {
  login,
  register,
  listUsers,
  verifyEmail,
  resendVerification,
} from '@/modules/identity/di/container'

export const loginRoute = pub.identity.login.handler(async ({ input, context }) => {
  const token = await login(input)

  setCookie(context.resHeaders, ENV.COOKIE.NAME, token, {
    httpOnly: ENV.COOKIE.HTTP_ONLY,
    sameSite: ENV.COOKIE.SAME_SITE,
    secure: ENV.COOKIE.SECURE,
  })

  return { message: 'Login successful' }
})

export const registerRoute = pub.identity.register.handler(async ({ input }) => {
  await register(input)

  return {
    message: 'User registered successfully. Please check your email for verification code.',
  }
})

export const verifyEmailRoute = pub.identity.verifyEmail.handler(async ({ input }) => {
  await verifyEmail(input)

  return {
    message: 'Email verified successfully',
  }
})

export const resendVerificationRoute = pub.identity.resendVerification.handler(
  async ({ input }) => {
    await resendVerification(input)

    return {
      message: 'Verification code sent to your email',
    }
  }
)

export const logoutRoute = auth.identity.logout.handler(async ({ context }) => {
  setCookie(context.resHeaders, ENV.COOKIE.NAME, '', {
    httpOnly: ENV.COOKIE.HTTP_ONLY,
    sameSite: ENV.COOKIE.SAME_SITE,
    secure: ENV.COOKIE.SECURE,
    maxAge: 0,
  })

  return {
    message: 'Logged out successfully',
  }
})

export const meRoute = auth.identity.me.handler(async ({ context: { user } }) => ({ user }))

export const listUsersRoute = auth.identity.listUsers.handler(async ({ input }) => {
  const result = await listUsers(input.page, input.limit)

  return {
    users: result.data,
    meta: result.meta,
  }
})
