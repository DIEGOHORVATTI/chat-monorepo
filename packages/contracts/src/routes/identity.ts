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
} from '../schemas/identity'

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
})
