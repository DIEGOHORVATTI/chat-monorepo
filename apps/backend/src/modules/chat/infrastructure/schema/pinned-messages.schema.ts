import { uuid, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { users } from '@/modules/identity/infrastructure/schema/users.schema'

import { chats } from './chats.schema'
import { messages } from './messages.schema'

export const pinnedMessages = pgTable('pinned_messages', {
  id: uuid('id').primaryKey(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  messageId: uuid('message_id')
    .notNull()
    .unique()
    .references(() => messages.id, { onDelete: 'cascade' }),
  pinnedBy: uuid('pinned_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
