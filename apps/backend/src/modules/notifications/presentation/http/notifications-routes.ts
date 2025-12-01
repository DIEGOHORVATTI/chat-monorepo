import type { NotificationsContainer } from '@/modules/notifications/container'

export const createNotificationsRoutes = (container: NotificationsContainer) => ({
  getNotifications: async ({ input, context }) => {
    const {
      page = 1,
      limit = 20,
      isRead,
      type,
    } = input as {
      page?: number
      limit?: number
      isRead?: boolean
      type?:
        | 'new_message'
        | 'mention'
        | 'new_participant'
        | 'participant_left'
        | 'call_missed'
        | 'call_incoming'
        | 'reaction'
        | 'pin_message'
    }

    const result = await container.getNotifications(context.user.id, page, limit, isRead, type)

    return {
      data: result.data,
      meta: result.meta,
    }
  },

  markAsRead: async (input: unknown, context: ORPCContext) => {
    const { notificationIds } = input as { notificationIds: string[] }

    await container.markAsRead(context.user.id, notificationIds)

    return {
      message: 'Notifications marked as read',
      meta: { timestamp: new Date() },
    }
  },

  markAllAsRead: async (_input, context: ORPCContext) => {
    await container.markAllAsRead(context.user.id)

    return {
      message: 'All notifications marked as read',
      meta: { timestamp: new Date() },
    }
  },

  getSettings: async (_input: unknown, context: ORPCContext) => {
    const settings = await container.getSettings(context.user.id)

    return {
      data: settings,
      meta: { timestamp: new Date() },
    }
  },

  updateSettings: async (input: unknown, context: ORPCContext) => {
    const data = input as {
      pushEnabled?: boolean
      emailEnabled?: boolean
      messageNotifications?: boolean
      mentionNotifications?: boolean
      callNotifications?: boolean
      reactionNotifications?: boolean
      muteAll?: boolean
      mutedUntil?: Date
    }

    const settings = await container.updateSettings(context.user.id, data)

    return {
      data: settings,
      meta: { timestamp: new Date() },
    }
  },

  muteChat: async (input: unknown, context: ORPCContext) => {
    const { chatId } = input as { chatId: string }

    await container.muteChat(context.user.id, chatId)

    return {
      message: 'Chat muted successfully',
      meta: { timestamp: new Date() },
    }
  },

  unmuteChat: async (input: unknown, context: ORPCContext) => {
    const { chatId } = input as { chatId: string }

    await container.unmuteChat(context.user.id, chatId)

    return {
      message: 'Chat unmuted successfully',
      meta: { timestamp: new Date() },
    }
  },

  getUnreadCount: async (_input: unknown, context: ORPCContext) => {
    const result = await container.getUnreadCount(context.user.id)

    return {
      unreadCount: result,
      meta: { timestamp: new Date() },
    }
  },
})
