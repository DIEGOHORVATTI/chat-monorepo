import { users } from '@/modules/identity/infrastructure/db/schema'
import { text, uuid, jsonb, pgEnum, pgTable, boolean, timestamp } from 'drizzle-orm/pg-core'

export const notificationTypeEnum = pgEnum('notification_type', [
  'new_message',
  'mention',
  'new_participant',
  'participant_left',
  'call_missed',
  'call_incoming',
  'reaction',
  'pin_message',
])

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  data: jsonb('data'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
