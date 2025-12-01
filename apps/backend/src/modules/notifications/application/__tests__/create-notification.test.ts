import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'

import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeCreateNotification } from '../create-notification'

describe('CreateNotification Use Case', () => {
  let notificationRepository: NotificationRepository
  let websocketService: NotificationWebSocketService
  let createNotification: ReturnType<typeof makeCreateNotification>

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
      sendNotification: vi.fn(async () => undefined),
      sendNotificationRead: async () => undefined,
      sendNotificationDeleted: async () => undefined,
    } as NotificationWebSocketService

    createNotification = makeCreateNotification(notificationRepository, websocketService)
  })

  it('should create notification and send via WebSocket', async () => {
    const result = await createNotification({
      userId: 'user-1',
      type: 'new_message',
      title: 'New Message',
      body: 'You have a new message',
      data: { chatId: 'chat-1', messageId: 'msg-1' },
    })

    expect(result).toBeDefined()
    expect(result.userId).toBe('user-1')
    expect(result.type).toBe('new_message')
    expect(result.title).toBe('New Message')
    expect(result.body).toBe('You have a new message')
    expect(result.isRead).toBe(false)
    expect(websocketService.sendNotification).toHaveBeenCalledWith('user-1', result)
  })

  it('should create notification without optional data', async () => {
    const result = await createNotification({
      userId: 'user-2',
      type: 'reaction',
      title: 'System Update',
      body: 'New features available',
    })

    expect(result).toBeDefined()
    expect(result.userId).toBe('user-2')
    expect(result.type).toBe('reaction')
    expect(result.data).toBeUndefined()
  })
})
