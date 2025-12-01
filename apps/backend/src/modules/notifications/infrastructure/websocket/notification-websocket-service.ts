import type { NotificationProps } from '@/modules/notifications/domain/entities'

export interface NotificationWebSocketService {
  sendNotification(userId: string, notification: NotificationProps): Promise<void>
  sendNotificationRead(userId: string, notificationIds: string[]): Promise<void>
  sendNotificationDeleted(userId: string, notificationId: string): Promise<void>
}

export class NotificationWebSocketServiceImpl implements NotificationWebSocketService {
  private connectedClients: Map<string, Set<WebSocket>> = new Map()

  registerClient(userId: string, ws: WebSocket): void {
    if (!this.connectedClients.has(userId)) {
      this.connectedClients.set(userId, new Set())
    }
    this.connectedClients.get(userId)!.add(ws)
  }

  unregisterClient(userId: string, ws: WebSocket): void {
    const userSockets = this.connectedClients.get(userId)
    if (userSockets) {
      userSockets.delete(ws)
      if (userSockets.size === 0) {
        this.connectedClients.delete(userId)
      }
    }
  }

  async sendNotification(userId: string, notification: NotificationProps): Promise<void> {
    const userSockets = this.connectedClients.get(userId)
    if (!userSockets || userSockets.size === 0) {
      return // User not connected, notification saved in DB only
    }

    const message = JSON.stringify({
      event: 'NOTIFICATION_RECEIVED',
      timestamp: new Date(),
      data: {
        notificationId: notification.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        createdAt: notification.createdAt,
      },
    })

    userSockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    })
  }

  async sendNotificationRead(userId: string, notificationIds: string[]): Promise<void> {
    const userSockets = this.connectedClients.get(userId)
    if (!userSockets || userSockets.size === 0) return

    const message = JSON.stringify({
      event: 'NOTIFICATION_READ',
      timestamp: new Date(),
      data: {
        notificationIds,
        readAt: new Date(),
      },
    })

    userSockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    })
  }

  async sendNotificationDeleted(userId: string, notificationId: string): Promise<void> {
    const userSockets = this.connectedClients.get(userId)
    if (!userSockets || userSockets.size === 0) return

    const message = JSON.stringify({
      event: 'NOTIFICATION_DELETED',
      timestamp: new Date(),
      data: {
        notificationId,
        deletedAt: new Date(),
      },
    })

    userSockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    })
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedClients.keys())
  }

  isUserConnected(userId: string): boolean {
    return this.connectedClients.has(userId) && this.connectedClients.get(userId)!.size > 0
  }
}

// Singleton instance
export const notificationWebSocketService = new NotificationWebSocketServiceImpl()
