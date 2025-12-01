import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeMarkAsRead } from '../mark-as-read'

describe('MarkAsRead Use Case', () => {
  let notificationRepository: NotificationRepository
  let websocketService: NotificationWebSocketService
  let markAsRead: ReturnType<typeof makeMarkAsRead>

  beforeEach(() => {
    notificationRepository = {
      findById: async () => null,
      findByUserId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } }),
      countUnreadByUserId: async () => 0,
      save: async (notification) => notification,
      markAsRead: async () => undefined,
      markAllAsReadByUserId: async () => undefined,
      delete: async () => undefined,
    } as NotificationRepository

    websocketService = {
      sendNotification: async () => undefined,
      sendNotificationRead: async () => undefined,
      sendNotificationDeleted: async () => undefined,
    } as NotificationWebSocketService

    markAsRead = makeMarkAsRead(notificationRepository, websocketService)
  })

  it('should mark notifications as read', async () => {
    await expect(markAsRead('user-1', ['notif-1', 'notif-2'])).resolves.toBeUndefined()
  })
})
