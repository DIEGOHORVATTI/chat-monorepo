import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { db } from '@/core/infra/db/drizzle'
 
import { createNotificationsContainer } from '../container'

// Bridge to reuse existing container that expects NodePgDatabase
const container = createNotificationsContainer(db as unknown as NodePgDatabase)

export const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getSettings,
  updateSettings,
  muteChat,
  unmuteChat,
  getUnreadCount,
} = container