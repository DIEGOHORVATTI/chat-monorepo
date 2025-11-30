import type { Meta, PaginationQuery } from '../../shared/types'

export enum PermissionType {
  USER_LIST = 'USER_LIST',
  USER_CREATE = 'USER_CREATE',
  USER_EDIT = 'USER_EDIT',
  USER_DELETE = 'USER_DELETE',
  POST_LIST = 'POST_LIST',
  POST_CREATE = 'POST_CREATE',
  POST_EDIT = 'POST_EDIT',
  POST_DELETE = 'POST_DELETE',
  VISION_STRATEGY_POST_LIST = 'VISION_STRATEGY_POST_LIST',
  VISION_STRATEGY_POST_CREATE = 'VISION_STRATEGY_POST_CREATE',
  VISION_STRATEGY_POST_EDIT = 'VISION_STRATEGY_POST_EDIT',
  VISION_STRATEGY_POST_DELETE = 'VISION_STRATEGY_POST_DELETE',
  CATEGORY_LIST = 'CATEGORY_LIST',
  CATEGORY_CREATE = 'CATEGORY_CREATE',
  CATEGORY_EDIT = 'CATEGORY_EDIT',
  CATEGORY_DELETE = 'CATEGORY_DELETE',
  COMMENT_LIST = 'COMMENT_LIST',
  COMMENT_CREATE = 'COMMENT_CREATE',
  COMMENT_EDIT = 'COMMENT_EDIT',
  COMMENT_DELETE = 'COMMENT_DELETE',
  FILE_LIST = 'FILE_LIST',
  FILE_UPLOAD = 'FILE_UPLOAD',
  FILE_DELETE = 'FILE_DELETE',
  EVENT_LIST = 'EVENT_LIST',
  EVENT_CREATE = 'EVENT_CREATE',
  EVENT_EDIT = 'EVENT_EDIT',
  EVENT_DELETE = 'EVENT_DELETE',
}

export type PrivacyVisibility = 'everyone' | 'contacts' | 'contacts_except' | 'nobody'

export interface PrivacySettings {
  profilePhoto: PrivacyVisibility
  lastSeen: PrivacyVisibility
  status: PrivacyVisibility
  readReceipts: boolean
  allowMessagesFrom: PrivacyVisibility
  allowCallsFrom: PrivacyVisibility
  blockedUsers: string[]
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  avatarUrl?: string | null
  isEmailVerified?: boolean
  isActive: boolean
  lastLoginAt?: Date | null
  timezone?: string | null
  permissions: PermissionType[]
  privacy: PrivacySettings
  createdAt: Date
  updatedAt: Date
}

export interface Login {
  email: string
  password: string
}

export interface Register {
  name: string
  email: string
  password: string
}

export interface VerifyEmail {
  userId: string
  code: string
}

export type UserQuery = PaginationQuery

export interface Email {
  email: string
}

export interface UserCreate {
  name: string
  email: string
}

export interface UpdateProfile {
  name?: string
  avatarUrl?: string
  timezone?: string
}

export interface ChangePassword {
  oldPassword: string
  newPassword: string
}

export interface PrivacyUpdate extends Partial<PrivacySettings> {}

export enum UserStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export interface UpdateStatus {
  status: UserStatus
}

export interface SetCustomStatus {
  customStatus: string
  emoji?: string
  expiresAt?: Date
}

export interface OnlineUser {
  id: string
  name: string
  avatarUrl?: string | null
  status: UserStatus
  customStatus?: string
  lastSeen: Date
}

export interface MessageResponse {
  message: string
}

export interface RegisterResponse {
  message: string
}

export interface UserResponse {
  user: Omit<User, 'password'>
}

export interface UsersListResponse {
  users: Omit<User, 'password'>[]
  meta: Meta
}

export interface OnlineUsersResponse {
  users: OnlineUser[]
  meta: Meta
}

export interface StatusResponse {
  status: UserStatus
  customStatus?: string
}

export interface ExportUserData {
  format?: 'json' | 'csv'
}

export interface ExportDataResponse {
  downloadUrl: string
  expiresAt: Date
  meta: Meta
}

export interface DeleteAccount {
  password: string
  confirmation: string
}

export interface ForgotPassword {
  email: string
}

export interface ResetPassword {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface RefreshToken {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  meta: Meta
}

export interface UserProfileResponse {
  user: Omit<User, 'password'>
  meta: Meta
}
