import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationWebSocketService } from '@/modules/notifications/infrastructure/websocket/notification-websocket-service'

import { createNotification } from '@/modules/notifications/domain/entities'

export type CreateNotificationData = {
  userId: string
  type:
    | 'new_message'
    | 'mention'
    | 'new_participant'
    | 'participant_left'
    | 'call_missed'
    | 'call_incoming'
    | 'reaction'
    | 'pin_message'
  title: string
  body: string
  data?: Record<string, unknown>
}

export const makeCreateNotification =
  (
    notificationRepository: NotificationRepository,
    websocketService: NotificationWebSocketService
  ) =>
  async (data: CreateNotificationData) => {
    const notification = createNotification({
      id: crypto.randomUUID(),
      userId: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      isRead: false,
      data: data.data,
      createdAt: new Date(),
    })

    // Save to database
    const saved = await notificationRepository.save(notification)

    // Send via WebSocket (real-time push)
    await websocketService.sendNotification(data.userId, saved)

    return saved
  }
