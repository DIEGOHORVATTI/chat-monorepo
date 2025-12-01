import { text, uuid, pgEnum, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { users } from '@/modules/identity/infrastructure/schema/users.schema'

export const chatTypeEnum = pgEnum('chat_type', ['DIRECT', 'GROUP'])

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey(),
  type: chatTypeEnum('type').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  participantIds: text('participant_ids')
    .array()
    .notNull()
    .$defaultFn(() => []),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
