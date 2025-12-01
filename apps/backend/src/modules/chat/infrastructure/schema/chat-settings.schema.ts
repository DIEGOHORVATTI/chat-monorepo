import { text, uuid, boolean, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { chats } from './chats.schema'

export const chatSettings = pgTable('chat_settings', {
  id: uuid('id').primaryKey(),
  chatId: uuid('chat_id')
    .notNull()
    .unique()
    .references(() => chats.id, { onDelete: 'cascade' }),
  description: text('description'),
  rules: text('rules'),
  allowMemberInvites: boolean('allow_member_invites').notNull().default(true),
  allowMemberMessages: boolean('allow_member_messages').notNull().default(true),
  muteNotifications: boolean('mute_notifications').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
