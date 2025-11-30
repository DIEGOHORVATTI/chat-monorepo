import { z } from 'zod'
import { meta, paginationSchema } from './base'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum PermissionType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
}

const privacyVisibility = z.enum(['everyone', 'contacts', 'contacts_except', 'nobody'])

const privacySettingsSchema = z.object({
  profilePhoto: privacyVisibility,
  lastSeen: privacyVisibility,
  status: privacyVisibility,
  readReceipts: z.boolean(),
  allowMessagesFrom: privacyVisibility,
  allowCallsFrom: privacyVisibility,
  blockedUsers: z.array(z.string().uuid()),
})

const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  password: z.string().min(6),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  avatarUrl: z.url().nullable().optional(),
  isEmailVerified: z.boolean().optional(),
  lastLoginAt: z.date().nullable().optional(),
  timezone: z.string().nullable().optional(),
  permissions: z.array(z.enum(Object.values(PermissionType))),
  privacy: privacySettingsSchema.default({
    profilePhoto: 'everyone',
    lastSeen: 'everyone',
    status: 'everyone',
    readReceipts: true,
    allowMessagesFrom: 'everyone',
    allowCallsFrom: 'everyone',
    blockedUsers: [],
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const privacyUpdateSchema = privacySettingsSchema.partial()

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
})

export const registerSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
})

export const verifyEmailSchema = z.object({
  userId: z.string(),
  code: z.string().length(6),
})

export const userQuerySchema = paginationSchema

export const emailSchema = userSchema.pick({
  email: true,
})

export const userCreateSchema = userSchema.pick({
  name: true,
  email: true,
})

export const messageResponseSchema = z.object({
  message: z.string(),
})

export const registerResponseSchema = z.object({
  message: z.string(),
})

export const userResponseSchema = z.object({
  user: userSchema.omit({ password: true }),
})

export const usersListResponseSchema = z.object({
  users: z.array(userSchema.omit({ password: true })),
  meta,
})

export type Login = z.infer<typeof loginSchema>
export type Register = z.infer<typeof registerSchema>
export type VerifyEmail = z.infer<typeof verifyEmailSchema>
export type Email = z.infer<typeof emailSchema>
export type UserCreate = z.infer<typeof userCreateSchema>
export type MessageResponse = z.infer<typeof messageResponseSchema>
export type User = z.infer<typeof userSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
export type UsersListResponse = z.infer<typeof usersListResponseSchema>
