import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../identity/identity.schema'
import {
  getNotificationsQuerySchema,
  markAsReadSchema,
  updateNotificationSettingsSchema,
  notificationResponseSchema,
  notificationsListResponseSchema,
  notificationSettingsResponseSchema,
  notificationUnreadCountResponseSchema,
} from './notifications.schema'

const prefix = oc.route({ tags: ['Notifications'] })

export const notifications = oc.prefix('/notifications').router({
  getNotifications: prefix
    .route({
      method: 'GET',
      path: '/',
      summary: 'Obter notificações',
      description: 'Obtém lista paginada de notificações do usuário atual',
    })
    .input(getNotificationsQuerySchema)
    .output(notificationsListResponseSchema),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/read',
      summary: 'Marcar como lida',
      description: 'Marca uma ou mais notificações como lidas',
    })
    .input(markAsReadSchema)
    .output(messageResponseSchema),

  markAllAsRead: prefix
    .route({
      method: 'POST',
      path: '/read-all',
      summary: 'Marcar todas como lidas',
      description: 'Marca todas as notificações como lidas',
    })
    .output(messageResponseSchema),

  getSettings: prefix
    .route({
      method: 'GET',
      path: '/settings',
      summary: 'Obter configurações',
      description: 'Obtém configurações de notificações do usuário atual',
    })
    .output(notificationSettingsResponseSchema),

  updateSettings: prefix
    .route({
      method: 'PATCH',
      path: '/settings',
      summary: 'Atualizar configurações',
      description: 'Atualiza configurações de notificações',
    })
    .input(updateNotificationSettingsSchema)
    .output(notificationSettingsResponseSchema),

  muteChat: prefix
    .route({
      method: 'POST',
      path: '/mute/:chatId',
      summary: 'Silenciar chat',
      description: 'Silencia notificações de um chat específico',
    })
    .output(messageResponseSchema),

  unmuteChat: prefix
    .route({
      method: 'DELETE',
      path: '/mute/:chatId',
      summary: 'Reativar chat',
      description: 'Reativa notificações de um chat específico',
    })
    .output(messageResponseSchema),

  getUnreadCount: prefix
    .route({
      method: 'GET',
      path: '/unread-count',
      summary: 'Obter contador de não lidas',
      description: 'Obtém total de notificações não lidas',
    })
    .output(notificationUnreadCountResponseSchema),
})
