import type { NotificationProps } from '@/modules/notifications/domain/entities'

export class NotificationMapper {
  static toDomain(raw: Record<string, unknown>): NotificationProps {
    return {
      id: raw.id as string,
      userId: raw.userId as string,
      type: raw.type as NotificationProps['type'],
      title: raw.title as string,
      body: raw.body as string,
      isRead: raw.isRead as boolean,
      data: raw.data as Record<string, unknown> | undefined,
      createdAt: new Date(raw.createdAt as string),
    }
  }

  static toPersistence(notification: NotificationProps): Record<string, unknown> {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      data: notification.data,
      createdAt: notification.createdAt,
    }
  }
}
