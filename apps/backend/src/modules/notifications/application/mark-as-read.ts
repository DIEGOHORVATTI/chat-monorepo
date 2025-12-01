import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'

export const makeMarkAsRead =
  (
    notificationRepository: NotificationRepository,
    websocketService: NotificationWebSocketService
  ) =>
  async (userId: string, notificationIds: string[]) => {
    await notificationRepository.markAsRead(notificationIds)

    // Notify via WebSocket
    await websocketService.sendNotificationRead(userId, notificationIds)
  }
