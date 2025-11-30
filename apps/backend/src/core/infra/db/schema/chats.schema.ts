import { text, uuid, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users.schema'

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type', { enum: ['DIRECT', 'GROUP'] }).notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  participantIds: text('participant_ids').array().notNull().default([]),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
