import type { NotificationRepository } from '@/modules/notifications/domain/repositories'

export const makeGetUnreadCount =
  (notificationRepository: NotificationRepository) => async (userId: string) => {
    const total = await notificationRepository.countUnreadByUserId(userId)

    return {
      total,
    }
  }
