import { uuid, boolean, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { chats } from './chats.schema'

export const groupPermissions = pgTable('group_permissions', {
  id: uuid('id').primaryKey(),
  chatId: uuid('chat_id')
    .notNull()
    .unique()
    .references(() => chats.id, { onDelete: 'cascade' }),
  canSendMessages: boolean('can_send_messages').notNull().default(true),
  canAddMembers: boolean('can_add_members').notNull().default(true),
  canRemoveMembers: boolean('can_remove_members').notNull().default(false),
  canEditGroupInfo: boolean('can_edit_group_info').notNull().default(false),
  canPinMessages: boolean('can_pin_messages').notNull().default(false),
  canDeleteMessages: boolean('can_delete_messages').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
