/**
 * Identity module types
 * Pure TypeScript interfaces - no dependencies on validation libraries
 */

import type { Meta, PaginationQuery } from '../../shared/types'

export enum PermissionType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
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

// Response types
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
