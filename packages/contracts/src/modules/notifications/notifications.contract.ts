import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../identity/identity.schema'
import {
  getNotificationsQuerySchema,
  markAsReadSchema,
  updateNotificationSettingsSchema,
  notificationResponseSchema,
  notificationsListResponseSchema,
  notificationSettingsResponseSchema,
} from './notifications.schema'

const prefix = oc.route({ tags: ['Notifications'] })

export const notifications = oc.prefix('/notifications').router({
  getNotifications: prefix
    .route({
      method: 'GET',
      path: '/',
      summary: 'Get notifications',
      description: 'Get paginated list of notifications for the current user',
    })
    .input(getNotificationsQuerySchema)
    .output(notificationsListResponseSchema),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/read',
      summary: 'Mark as read',
      description: 'Mark one or more notifications as read',
    })
    .input(markAsReadSchema)
    .output(messageResponseSchema),

  markAllAsRead: prefix
    .route({
      method: 'POST',
      path: '/read-all',
      summary: 'Mark all as read',
      description: 'Mark all notifications as read',
    })
    .output(messageResponseSchema),

  getSettings: prefix
    .route({
      method: 'GET',
      path: '/settings',
      summary: 'Get settings',
      description: 'Get notification settings for the current user',
    })
    .output(notificationSettingsResponseSchema),

  updateSettings: prefix
    .route({
      method: 'PATCH',
      path: '/settings',
      summary: 'Update settings',
      description: 'Update notification settings',
    })
    .input(updateNotificationSettingsSchema)
    .output(notificationSettingsResponseSchema),

  muteChat: prefix
    .route({
      method: 'POST',
      path: '/mute/:chatId',
      summary: 'Mute chat',
      description: 'Mute notifications for a specific chat',
    })
    .output(messageResponseSchema),

  unmuteChat: prefix
    .route({
      method: 'DELETE',
      path: '/mute/:chatId',
      summary: 'Unmute chat',
      description: 'Unmute notifications for a specific chat',
    })
    .output(messageResponseSchema),
})
