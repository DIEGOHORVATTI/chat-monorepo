import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { notificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'
import {
  DrizzleNotificationRepository,
  DrizzleNotificationSettingsRepository,
} from '@/modules/notifications/infrastructure/repositories'
import {
  makeMuteChat,
  makeMarkAsRead,
  makeUnmuteChat,
  makeGetSettings,
  makeMarkAllAsRead,
  makeGetUnreadCount,
  makeUpdateSettings,
  makeGetNotifications,
  makeCreateNotification,
} from '@/modules/notifications/application'

export const createNotificationsContainer = (db: NodePgDatabase) => {
  const notificationRepository = new DrizzleNotificationRepository(db)
  const settingsRepository = new DrizzleNotificationSettingsRepository(db)

  return {
    createNotification: makeCreateNotification(
      notificationRepository,
      notificationWebSocketService
    ),
    getNotifications: makeGetNotifications(notificationRepository),
    markAsRead: makeMarkAsRead(notificationRepository, notificationWebSocketService),
    markAllAsRead: makeMarkAllAsRead(notificationRepository, notificationWebSocketService),
    getSettings: makeGetSettings(settingsRepository),
    updateSettings: makeUpdateSettings(settingsRepository),
    muteChat: makeMuteChat(settingsRepository),
    unmuteChat: makeUnmuteChat(settingsRepository),
    getUnreadCount: makeGetUnreadCount(notificationRepository),
  }
}

export type NotificationsContainer = ReturnType<typeof createNotificationsContainer>
