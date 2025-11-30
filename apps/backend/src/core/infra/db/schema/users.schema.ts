import { text, uuid, jsonb, pgEnum, boolean, pgTable, timestamp } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('UserRole', ['ADMIN', 'USER'])

export const userStatusEnum = pgEnum('UserStatus', ['ONLINE', 'AWAY', 'BUSY', 'OFFLINE'])

export const permissionTypeEnum = pgEnum('PermissionType', [
  'USER_LIST',
  'USER_CREATE',
  'USER_EDIT',
  'USER_DELETE',
  'POST_LIST',
  'POST_CREATE',
  'POST_EDIT',
  'POST_DELETE',
  'VISION_STRATEGY_POST_LIST',
  'VISION_STRATEGY_POST_CREATE',
  'VISION_STRATEGY_POST_EDIT',
  'VISION_STRATEGY_POST_DELETE',
  'CATEGORY_LIST',
  'CATEGORY_CREATE',
  'CATEGORY_EDIT',
  'CATEGORY_DELETE',
  'COMMENT_LIST',
  'COMMENT_CREATE',
  'COMMENT_EDIT',
  'COMMENT_DELETE',
  'FILE_LIST',
  'FILE_UPLOAD',
  'FILE_DELETE',
  'EVENT_LIST',
  'EVENT_CREATE',
  'EVENT_EDIT',
  'EVENT_DELETE',
])

export const users = pgTable('User', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('USER'),
  permissions: permissionTypeEnum('permissions').array().notNull().default([]),
  avatarUrl: text('avatarUrl'),
  isEmailVerified: boolean('isEmailVerified').notNull().default(false),
  isActive: boolean('isActive').notNull().default(true),
  lastLoginAt: timestamp('lastLoginAt', { withTimezone: true }),
  timezone: text('timezone'),
  status: userStatusEnum('status').notNull().default('OFFLINE'),
  customStatus: text('customStatus'),
  customStatusEmoji: text('customStatusEmoji'),
  customStatusExpiresAt: timestamp('customStatusExpiresAt', { withTimezone: true }),
  privacy: jsonb('privacy').$type<{
    profilePhoto: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
    lastSeen: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
    status: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
    readReceipts: boolean
    allowMessagesFrom: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
    allowCallsFrom: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
    blockedUsers: string[]
  }>()
    .notNull()
    .default({
      profilePhoto: 'everyone',
      lastSeen: 'everyone',
      status: 'everyone',
      readReceipts: true,
      allowMessagesFrom: 'everyone',
      allowCallsFrom: 'everyone',
      blockedUsers: [],
    }),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
