import { auth } from '@repo/service-core'
import {
  muteChat,
  markAsRead,
  unmuteChat,
  getSettings,
  markAllAsRead,
  updateSettings,
  getUnreadCount,
  getNotifications,
} from '@notifications/di/container'

export const getNotificationsRoute = auth.notifications.getNotifications.handler(
  async ({ input, context: { user } }) => {
    const result = await getNotifications(user.id, page, limit, input.isRead, input.type)

    return {
      data: result.data,
      meta: result.meta,
    }
  }
)

export const markAsReadRoute = auth.notifications.markAsRead.handler(
  async ({ input, context: { user } }) => {
    await markAsRead(user.id, input.notificationIds)

    return {
      message: 'Notifications marked as read',
    }
  }
)

export const markAllAsReadRoute = auth.notifications.markAllAsRead.handler(
  async ({ context: { user } }) => {
    await markAllAsRead(user.id)

    return {
      message: 'All notifications marked as read',
    }
  }
)

export const getSettingsRoute = auth.notifications.getSettings.handler(
  async ({ context: { user } }) => {
    const settings = await getSettings(user.id)

    return {
      data: settings,
      meta: { total: 1, page: 1, limit: 1, pages: 1 },
    }
  }
)

export const updateSettingsRoute = auth.notifications.updateSettings.handler(
  async ({ input, context: { user } }) => {
    const settings = await updateSettings(user.id, input)

    return {
      data: settings,
      meta: { total: 1, page: 1, limit: 1, pages: 1 },
    }
  }
)

export const muteChatRoute = auth.notifications.muteChat.handler(
  async ({ input, context: { user } }) => {
    const { chatId } = input as { chatId: string }
    await muteChat(user.id, chatId)

    return {
      message: 'Chat muted successfully',
    }
  }
)

export const unmuteChatRoute = auth.notifications.unmuteChat.handler(
  async ({ input, context: { user } }) => {
    const { chatId } = input as { chatId: string }
    await unmuteChat(user.id, chatId)

    return {
      message: 'Chat unmuted successfully',
    }
  }
)

export const getUnreadCountRoute = auth.notifications.getUnreadCount.handler(
  async ({ context: { user } }) => {
    const unread = await getUnreadCount(user.id)

    return {
      unreadCount: unread,
      meta: { total: 1, page: 1, limit: 1, pages: 1 },
    }
  }
)
