import { text, uuid, boolean, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users.schema'

export const contacts = pgTable('Contact', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  contactId: uuid('contactId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  nickname: text('nickname'),
  favorite: boolean('favorite').notNull().default(false),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
})

export type ContactSchema = typeof contacts.$inferSelect
export type NewContactSchema = typeof contacts.$inferInsert
