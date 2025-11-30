import { oc } from '@orpc/contract'

import {
  emailSchema,
  loginSchema,
  registerSchema,
  userQuerySchema,
  userCreateSchema,
  verifyEmailSchema,
  userResponseSchema,
  messageResponseSchema,
  registerResponseSchema,
  usersListResponseSchema,
  privacyUpdateSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateStatusSchema,
  setCustomStatusSchema,
  onlineUsersResponseSchema,
  statusResponseSchema,
  exportUserDataSchema,
  exportDataResponseSchema,
  deleteAccountSchema,
} from './identity.schema'

const prefix = oc.route({ tags: ['Identity'] })

export const identity = oc.prefix('/identity').router({
  login: prefix
    .route({
      method: 'POST',
      path: '/login',
      summary: 'Login user',
      description: 'Authenticate a user and return a JWT token',
    })
    .input(loginSchema)
    .output(messageResponseSchema),

  register: prefix
    .route({
      method: 'POST',
      path: '/register',
      summary: 'Register user',
      description: 'Register a new user',
    })
    .input(registerSchema)
    .output(registerResponseSchema),

  verifyEmail: prefix
    .route({
      method: 'POST',
      path: '/verify-email',
      summary: 'Verify email',
      description: 'Verify user email with verification code',
    })
    .input(verifyEmailSchema)
    .output(messageResponseSchema),

  resendVerification: prefix
    .route({
      method: 'POST',
      path: '/resend-verification',
      summary: 'Resend verification code',
      description: 'Resend email verification code',
    })
    .input(emailSchema)
    .output(messageResponseSchema),

  logout: prefix
    .route({
      method: 'GET',
      path: '/logout',
      summary: 'Logout user',
      description: 'Clear authentication token',
    })
    .output(messageResponseSchema),

  me: prefix
    .route({
      method: 'GET',
      path: '/me',
      summary: 'Get current user',
      description: 'Get the currently authenticated user',
    })
    .output(userResponseSchema),

  listUsers: prefix
    .route({
      method: 'GET',
      path: '/users',
      summary: 'List users',
      description: 'List all users',
    })
    .input(userQuerySchema)
    .output(usersListResponseSchema),

  createUser: prefix
    .route({
      method: 'POST',
      path: '/users',
      summary: 'Create user',
      description: 'Create a new user',
    })
    .input(userCreateSchema)
    .output(userResponseSchema),

  updatePrivacy: prefix
    .route({
      method: 'PATCH',
      path: '/me/privacy',
      summary: 'Update privacy settings',
      description: 'Update authenticated user privacy settings',
    })
    .input(privacyUpdateSchema)
    .output(userResponseSchema),

  updateProfile: prefix
    .route({
      method: 'PATCH',
      path: '/me/profile',
      summary: 'Update profile info',
      description: 'Update name, avatar or timezone',
    })
    .input(updateProfileSchema)
    .output(userResponseSchema),

  changePassword: prefix
    .route({
      method: 'PATCH',
      path: '/me/change-password',
      summary: 'Change password',
      description: 'Update the user password',
    })
    .input(changePasswordSchema)
    .output(messageResponseSchema),

  blockUser: prefix
    .route({
      method: 'POST',
      path: '/me/block/:userId',
      summary: 'Block user',
      description: 'Block another user',
    })
    .output(messageResponseSchema),

  unblockUser: prefix
    .route({
      method: 'DELETE',
      path: '/me/block/:userId',
      summary: 'Unblock user',
      description: 'Unblock previously blocked user',
    })
    .output(messageResponseSchema),

  updateStatus: prefix
    .route({
      method: 'PATCH',
      path: '/me/status',
      summary: 'Update status',
      description: 'Update user status (online/away/busy/offline)',
    })
    .input(updateStatusSchema)
    .output(statusResponseSchema),

  setCustomStatus: prefix
    .route({
      method: 'PATCH',
      path: '/me/custom-status',
      summary: 'Set custom status',
      description: 'Set custom status message with optional emoji and expiration',
    })
    .input(setCustomStatusSchema)
    .output(statusResponseSchema),

  clearCustomStatus: prefix
    .route({
      method: 'DELETE',
      path: '/me/custom-status',
      summary: 'Clear custom status',
      description: 'Remove custom status message',
    })
    .output(messageResponseSchema),

  getOnlineUsers: prefix
    .route({
      method: 'GET',
      path: '/users/online',
      summary: 'Get online users',
      description: 'List all online users',
    })
    .output(onlineUsersResponseSchema),

  exportUserData: prefix
    .route({
      method: 'POST',
      path: '/me/export',
      summary: 'Export user data',
      description: 'Request export of all user data (GDPR compliance)',
    })
    .input(exportUserDataSchema)
    .output(exportDataResponseSchema),

  deleteAccount: prefix
    .route({
      method: 'DELETE',
      path: '/me/account',
      summary: 'Delete account',
      description: 'Permanently delete user account and all associated data',
    })
    .input(deleteAccountSchema)
    .output(messageResponseSchema),
})
