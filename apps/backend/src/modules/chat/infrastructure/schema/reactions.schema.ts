import { text, uuid, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { users } from '@/modules/identity/infrastructure/schema/users.schema'

import { messages } from './messages.schema'

export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey(),
  messageId: uuid('message_id')
    .notNull()
    .references(() => messages.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  emoji: text('emoji').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
