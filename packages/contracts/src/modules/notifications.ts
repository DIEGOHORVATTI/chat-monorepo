import { oc } from '@orpc/contract'
import { z } from 'zod'
import { metaSchema, paginationSchema } from '../shared/base.schema'
import { messageResponseSchema } from '../shared/base.schema'

const notificationTypeValues = [
  'new_message',
  'mention',
  'new_participant',
  'participant_left',
  'call_missed',
  'call_incoming',
  'reaction',
  'pin_message',
]

const notificationSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  type: z.enum(notificationTypeValues),
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  data: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.coerce.date(),
})

const notificationSettingsSchema = z.object({
  userId: z.uuid(),
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  messageNotifications: z.boolean(),
  mentionNotifications: z.boolean(),
  callNotifications: z.boolean(),
  reactionNotifications: z.boolean(),
  muteAll: z.boolean(),
  mutedChats: z.array(z.uuid()),
  mutedUntil: z.coerce.date().optional(),
})

export const getNotificationsQuerySchema = paginationSchema.extend({
  isRead: z.boolean().optional(),
  type: z.enum(notificationTypeValues).optional(),
})

export const markAsReadSchema = z.object({
  notificationIds: z.array(z.uuid()).min(1),
})

export const updateNotificationSettingsSchema = z.object({
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  messageNotifications: z.boolean().optional(),
  mentionNotifications: z.boolean().optional(),
  callNotifications: z.boolean().optional(),
  reactionNotifications: z.boolean().optional(),
  muteAll: z.boolean().optional(),
  mutedUntil: z.coerce.date().optional(),
})

export const notificationResponseSchema = z.object({
  data: notificationSchema,
  meta: metaSchema,
})

export const notificationsListResponseSchema = z.object({
  data: z.array(notificationSchema),
  meta: metaSchema,
})

export const notificationSettingsResponseSchema = z.object({
  data: notificationSettingsSchema,
  meta: metaSchema,
})

const notificationUnreadCountSchema = z.object({
  total: z.number(),
})

export const notificationUnreadCountResponseSchema = z.object({
  unreadCount: notificationUnreadCountSchema,
  meta: metaSchema,
})

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
