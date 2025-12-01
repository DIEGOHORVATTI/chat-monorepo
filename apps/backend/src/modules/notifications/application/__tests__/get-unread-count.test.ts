import type { NotificationRepository } from '@/modules/notifications/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeGetUnreadCount } from '../get-unread-count'

describe('GetUnreadCount Use Case', () => {
  let notificationRepository: NotificationRepository
  let getUnreadCount: ReturnType<typeof makeGetUnreadCount>

  beforeEach(() => {
    notificationRepository = {
      findById: async () => null,
      findByUserId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } }),
      countUnreadByUserId: async () => 5,
      save: async (notification) => notification,
      markAsRead: async () => undefined,
      markAllAsReadByUserId: async () => undefined,
      delete: async () => undefined,
    } as NotificationRepository

    getUnreadCount = makeGetUnreadCount(notificationRepository)
  })

  it('should get unread count', async () => {
    const result = await getUnreadCount('user-1')

    expect(result.total).toBe(5)
  })
})
