import type { NotificationRepository } from '@/modules/notifications/domain/repositories'

export const makeGetNotifications =
  (notificationRepository: NotificationRepository) =>
  async (
    userId: string,
    page: number,
    limit: number,
    isRead?: boolean,
    type?:
      | 'new_message'
      | 'mention'
      | 'new_participant'
      | 'participant_left'
      | 'call_missed'
      | 'call_incoming'
      | 'reaction'
      | 'pin_message'
  ) =>
    notificationRepository.findByUserId(userId, page, limit, isRead, type)
