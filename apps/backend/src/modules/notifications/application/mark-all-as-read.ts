import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'

export const makeMarkAllAsRead =
  (
    notificationRepository: NotificationRepository,
    websocketService: NotificationWebSocketService
  ) =>
  async (userId: string) => {
    // Get all unread notifications to notify clients
    const unreadNotifications = await notificationRepository.findByUserId(userId, 1, 1000, false)
    const notificationIds = unreadNotifications.data.map((n) => n.id)

    await notificationRepository.markAllAsReadByUserId(userId)

    // Notify via WebSocket
    if (notificationIds.length > 0) {
      await websocketService.sendNotificationRead(userId, notificationIds)
    }
  }
