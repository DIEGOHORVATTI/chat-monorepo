import { text, uuid, boolean, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users.schema'

export const emailVerifications = pgTable('EmailVerification', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
  isUsed: boolean('isUsed').notNull().default(false),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
})

export type EmailVerification = typeof emailVerifications.$inferSelect
export type NewEmailVerification = typeof emailVerifications.$inferInsert
