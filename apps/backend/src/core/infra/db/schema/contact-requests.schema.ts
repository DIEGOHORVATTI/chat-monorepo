import { text, uuid, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users.schema'

export const contactRequests = pgTable('ContactRequest', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('senderId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  receiverId: uuid('receiverId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  message: text('message'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type ContactRequestSchema = typeof contactRequests.$inferSelect
export type NewContactRequestSchema = typeof contactRequests.$inferInsert
