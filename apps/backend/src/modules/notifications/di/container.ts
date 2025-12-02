import { db } from '@/core/infra/db/drizzle'

import { createNotificationsContainer } from '../container'

const container = createNotificationsContainer(db)

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
