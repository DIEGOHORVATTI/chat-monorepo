import type { Entity } from '@/core/domain/entity'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

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

export type UserProps = {
  email: string
  name: string
  password: string
  role: UserRole
  avatarUrl?: string | null
  isActive: boolean
  isEmailVerified?: boolean
  lastLoginAt?: Date | null
  timezone?: string | null
  permissions: PermissionType[]
  createdAt: Date
  updatedAt: Date
}

export type User = Entity<UserProps>

export type EncodedJWTUser = {
  id: string
  email: string
  role: UserRole
  permissions: PermissionType[]
}

export const createUser = (props: UserProps, id?: string): User => ({
  id: id || crypto.randomUUID(),
  ...props,
})
