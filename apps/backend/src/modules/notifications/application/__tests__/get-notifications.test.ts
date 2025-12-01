import type { NotificationProps } from '@/modules/notifications/domain/entities'
import type { NotificationRepository } from '@/modules/notifications/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeGetNotifications } from '../get-notifications'

describe('GetNotifications Use Case', () => {
  let notificationRepository: NotificationRepository
  let getNotifications: ReturnType<typeof makeGetNotifications>

  beforeEach(() => {
    notificationRepository = {
      findById: async () => null,
      findByUserId: async () => ({
        data: [
          {
            id: 'notif-1',
            userId: 'user-1',
            type: 'new_message',
            title: 'New message',
            body: 'You have a new message',
            isRead: false,
            createdAt: new Date(),
          } as NotificationProps,
        ],
        meta: { total: 1, page: 1, limit: 20, pages: 1 },
      }),
      countUnreadByUserId: async () => 1,
      save: async (notification) => notification as NotificationProps,
      markAsRead: async () => undefined,
      markAllAsReadByUserId: async () => undefined,
      delete: async () => undefined,
    } as NotificationRepository

    getNotifications = makeGetNotifications(notificationRepository)
  })

  it('should get notifications successfully', async () => {
    const result = await getNotifications('user-1', 1, 20)

    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.type).toBe('new_message')
    expect(result.meta.total).toBe(1)
  })

  it('should filter by isRead', async () => {
    const result = await getNotifications('user-1', 1, 20, false)

    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.isRead).toBe(false)
  })

  it('should filter by type', async () => {
    const result = await getNotifications('user-1', 1, 20, undefined, 'new_message')

    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.type).toBe('new_message')
  })
})
