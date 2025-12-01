import { sql } from 'drizzle-orm'
import { users } from '@/modules/identity/infrastructure/db/schema'
import { text, uuid, boolean, pgTable, timestamp } from 'drizzle-orm/pg-core'

export const notificationSettings = pgTable('notification_settings', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  pushEnabled: boolean('push_enabled').notNull().default(true),
  emailEnabled: boolean('email_enabled').notNull().default(true),
  messageNotifications: boolean('message_notifications').notNull().default(true),
  mentionNotifications: boolean('mention_notifications').notNull().default(true),
  callNotifications: boolean('call_notifications').notNull().default(true),
  reactionNotifications: boolean('reaction_notifications').notNull().default(true),
  muteAll: boolean('mute_all').notNull().default(false),
  mutedChats: text('muted_chats')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  mutedUntil: timestamp('muted_until', { withTimezone: true }),
})
