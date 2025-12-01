import { uuid, pgEnum, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { users } from '@/modules/identity/infrastructure/schema/users.schema'

import { chats } from './chats.schema'

export const participantRoleEnum = pgEnum('participant_role', ['admin', 'member'])

export const chatParticipants = pgTable('chat_participants', {
  id: uuid('id').primaryKey(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: participantRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  leftAt: timestamp('left_at', { withTimezone: true }),
})
