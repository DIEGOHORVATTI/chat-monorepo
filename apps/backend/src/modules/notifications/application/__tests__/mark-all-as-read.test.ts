import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'

import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeMarkAllAsRead } from '../mark-all-as-read'

describe('MarkAllAsRead Use Case', () => {
  let notificationRepository: NotificationRepository
  let websocketService: NotificationWebSocketService
  let markAllAsRead: ReturnType<typeof makeMarkAllAsRead>

  beforeEach(() => {
    websocketService = {
      sendNotification: async () => undefined,
      sendNotificationRead: vi.fn(async () => undefined),
      sendNotificationDeleted: async () => undefined,
    } as NotificationWebSocketService

    markAllAsRead = makeMarkAllAsRead(notificationRepository, websocketService)
  })

  it('should mark all notifications as read and emit WebSocket event', async () => {
    const unreadNotifications = [
      {
        id: 'notif-1',
        userId: 'user-1',
        type: 'new_message' as const,
        title: 'Message 1',
        body: 'Body 1',
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: 'notif-2',
        userId: 'user-1',
        type: 'new_message' as const,
        title: 'Message 2',
        body: 'Body 2',
        isRead: false,
        createdAt: new Date(),
      },
    ]

    notificationRepository = {
      findById: async () => null,
      findByUserId: async () => ({
        data: unreadNotifications,
        meta: { total: 2, page: 1, limit: 20, pages: 1 },
      }),
      countUnreadByUserId: async () => 2,
      save: async (notification) => notification,
      markAsRead: async () => undefined,
      markAllAsReadByUserId: async () => undefined,
      delete: async () => undefined,
    } as NotificationRepository

    markAllAsRead = makeMarkAllAsRead(notificationRepository, websocketService)

    await expect(markAllAsRead('user-1')).resolves.toBeUndefined()
    expect(websocketService.sendNotificationRead).toHaveBeenCalledWith('user-1', [
      'notif-1',
      'notif-2',
    ])
  })

  it('should not emit WebSocket event when no unread notifications', async () => {
    notificationRepository = {
      findById: async () => null,
      findByUserId: async () => ({
        data: [],
        meta: { total: 0, page: 1, limit: 20, pages: 0 },
      }),
      countUnreadByUserId: async () => 0,
      save: async (notification) => notification,
      markAsRead: async () => undefined,
      markAllAsReadByUserId: async () => undefined,
      delete: async () => undefined,
    } as NotificationRepository

    markAllAsRead = makeMarkAllAsRead(notificationRepository, websocketService)

    await expect(markAllAsRead('user-1')).resolves.toBeUndefined()
    expect(websocketService.sendNotificationRead).not.toHaveBeenCalled()
  })
})
