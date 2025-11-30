import { uuid, pgTable, timestamp, primaryKey } from 'drizzle-orm/pg-core'

import { users } from './users.schema'

export const blockedUsers = pgTable(
  'BlockedUser',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    blockedUserId: uuid('blockedUserId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.blockedUserId] }),
  })
)

export type BlockedUser = typeof blockedUsers.$inferSelect
export type NewBlockedUser = typeof blockedUsers.$inferInsert
