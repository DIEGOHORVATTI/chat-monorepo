import { setCookie } from '@orpc/server/helpers'
import { pub, ENV, auth } from '@repo/service-core'
import {
  login,
  register,
  blockUser,
  listUsers,
  getUserById,
  unblockUser,
  verifyEmail,
  updateProfile,
  changePassword,
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

export const getUserByIdRoute = auth.identity.getUserById.handler(async ({ input }) => {
  const user = await getUserById(input.userId)

  return {
    user,
    meta: {
      total: 1,
      page: 1,
      limit: 1,
      pages: 1,
    },
  }
})

export const updateProfileRoute = auth.identity.updateProfile.handler(
  async ({ input, context: { user } }) => {
    const updatedUser = await updateProfile(user.id, input)

    return {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        permissions: updatedUser.permissions,
      },
    }
  }
)

export const changePasswordRoute = auth.identity.changePassword.handler(
  async ({ input, context: { user } }) => {
    await changePassword(user.id, input)

    return {
      message: 'Password changed successfully',
    }
  }
)

export const blockUserRoute = auth.identity.blockUser.handler(
  async ({ input, context: { user } }) => {
    await blockUser(user.id, input.userId)

    return {
      message: 'User blocked successfully',
    }
  }
)

export const unblockUserRoute = auth.identity.unblockUser.handler(
  async ({ input, context: { user } }) => {
    await unblockUser(user.id, input.userId)

    return {
      message: 'User unblocked successfully',
    }
  }
)
