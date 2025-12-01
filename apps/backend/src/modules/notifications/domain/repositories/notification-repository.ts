import type { ListResponse } from '@/core/domain/entity'

import type { NotificationType, NotificationProps } from '../entities'

export interface NotificationRepository {
  findById(id: string): Promise<NotificationProps | null>
  findByUserId(
    userId: string,
    page: number,
    limit: number,
    isRead?: boolean,
    type?: NotificationType
  ): Promise<ListResponse<NotificationProps>>
  countUnreadByUserId(userId: string): Promise<number>
  save(notification: NotificationProps): Promise<NotificationProps>
  markAsRead(notificationIds: string[]): Promise<void>
  markAllAsReadByUserId(userId: string): Promise<void>
  delete(id: string): Promise<void>
}
