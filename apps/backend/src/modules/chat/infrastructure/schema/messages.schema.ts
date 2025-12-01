import { text, uuid, pgEnum, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { users } from '@/modules/identity/infrastructure/schema/users.schema'

import { chats } from './chats.schema'

export const messageTypeEnum = pgEnum('message_type', [
  'TEXT',
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'FILE',
  'VOICE',
  'LOCATION',
])

export const messageStatusEnum = pgEnum('message_status', ['SENT', 'DELIVERED', 'READ', 'FAILED'])

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: messageTypeEnum('type').notNull().default('TEXT'),
  status: messageStatusEnum('status').notNull().default('SENT'),
  replyToId: uuid('reply_to_id').references(() => messages.id, { onDelete: 'set null' }),
  metadata: text('metadata'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
