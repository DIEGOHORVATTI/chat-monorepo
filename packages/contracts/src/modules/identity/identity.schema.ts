import { z } from 'zod'
import { meta, paginationSchema } from '../../shared/base.schema'
import { PermissionType, UserStatus } from './types'
import type {
  User,
  Login,
  Register,
  VerifyEmail,
  UserQuery,
  Email,
  UserCreate,
  UpdateProfile,
  ChangePassword,
  PrivacySettings,
  PrivacyUpdate,
  UpdateStatus,
  SetCustomStatus,
  OnlineUser,
  MessageResponse,
  RegisterResponse,
  UserResponse,
  UsersListResponse,
  OnlineUsersResponse,
  StatusResponse,
} from './types'

const privacyVisibility = z.enum(['everyone', 'contacts', 'contacts_except', 'nobody'])

export const privacySettingsSchema = z.object({
  profilePhoto: privacyVisibility,
  lastSeen: privacyVisibility,
  status: privacyVisibility,
  readReceipts: z.boolean(),
  allowMessagesFrom: privacyVisibility,
  allowCallsFrom: privacyVisibility,
  blockedUsers: z.array(z.string().uuid()),
}) satisfies z.ZodType<PrivacySettings>

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  password: z.string().min(6),
  avatarUrl: z.url().nullable().optional(),
  isEmailVerified: z.boolean().optional(),
  lastLoginAt: z.date().nullable().optional(),
  timezone: z.string().nullable().optional(),
  permissions: z.array(z.nativeEnum(PermissionType)),
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
}) satisfies z.ZodType<User>

export const privacyUpdateSchema =
  privacySettingsSchema.partial() satisfies z.ZodType<PrivacyUpdate>

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
}) satisfies z.ZodType<Login>

export const registerSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
}) satisfies z.ZodType<Register>

export const verifyEmailSchema = z.object({
  userId: z.string(),
  code: z.string().length(6),
}) satisfies z.ZodType<VerifyEmail>

export const userQuerySchema = paginationSchema satisfies z.ZodType<UserQuery>

export const emailSchema = userSchema.pick({
  email: true,
}) satisfies z.ZodType<Email>

export const userCreateSchema = userSchema.pick({
  name: true,
  email: true,
}) satisfies z.ZodType<UserCreate>

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  avatarUrl: z.url().optional(),
  timezone: z.string().optional(),
}) satisfies z.ZodType<UpdateProfile>

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6),
}) satisfies z.ZodType<ChangePassword>

export const messageResponseSchema = z.object({
  message: z.string(),
}) satisfies z.ZodType<MessageResponse>

export const registerResponseSchema = z.object({
  message: z.string(),
}) satisfies z.ZodType<RegisterResponse>

export const userResponseSchema = z.object({
  user: userSchema.omit({ password: true }),
}) satisfies z.ZodType<UserResponse>

export const usersListResponseSchema = z.object({
  users: z.array(userSchema.omit({ password: true })),
  meta,
}) satisfies z.ZodType<UsersListResponse>

export const updateStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
}) satisfies z.ZodType<UpdateStatus>

export const setCustomStatusSchema = z.object({
  customStatus: z.string().max(100),
  emoji: z.string().optional(),
  expiresAt: z.date().optional(),
}) satisfies z.ZodType<SetCustomStatus>

const onlineUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  avatarUrl: z.url().nullable().optional(),
  status: z.nativeEnum(UserStatus),
  customStatus: z.string().optional(),
  lastSeen: z.date(),
}) satisfies z.ZodType<OnlineUser>

export const onlineUsersResponseSchema = z.object({
  users: z.array(onlineUserSchema),
  meta,
}) satisfies z.ZodType<OnlineUsersResponse>

export const statusResponseSchema = z.object({
  status: z.nativeEnum(UserStatus),
  customStatus: z.string().optional(),
}) satisfies z.ZodType<StatusResponse>
