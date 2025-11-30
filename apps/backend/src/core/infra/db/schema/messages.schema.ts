import { text, uuid, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { chats } from './chats.schema'
import { users } from './users.schema'

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: text('type', {
    enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'VOICE', 'LOCATION'],
  }).notNull(),
  status: text('status', { enum: ['SENT', 'DELIVERED', 'READ', 'FAILED'] }).notNull(),
  replyToId: uuid('reply_to_id'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})
