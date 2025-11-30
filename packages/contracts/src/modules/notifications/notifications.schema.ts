import { z } from 'zod'
import { metaSchema, paginationSchema } from '../../shared/base.schema'
import type {
  Notification,
  NotificationType,
  NotificationSettings,
  GetNotificationsQuery,
  MarkAsRead,
  UpdateNotificationSettings,
  NotificationResponse,
  NotificationsListResponse,
  NotificationSettingsResponse,
  NotificationUnreadCount,
  NotificationUnreadCountResponse,
} from './types'

const notificationTypeValues: [NotificationType, ...NotificationType[]] = [
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
}) satisfies z.ZodType<Notification>

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
}) satisfies z.ZodType<NotificationSettings>

export const getNotificationsQuerySchema = paginationSchema.extend({
  isRead: z.boolean().optional(),
  type: z.enum(notificationTypeValues).optional(),
}) satisfies z.ZodType<GetNotificationsQuery>

export const markAsReadSchema = z.object({
  notificationIds: z.array(z.uuid()).min(1),
}) satisfies z.ZodType<MarkAsRead>

export const updateNotificationSettingsSchema = z.object({
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  messageNotifications: z.boolean().optional(),
  mentionNotifications: z.boolean().optional(),
  callNotifications: z.boolean().optional(),
  reactionNotifications: z.boolean().optional(),
  muteAll: z.boolean().optional(),
  mutedUntil: z.coerce.date().optional(),
}) satisfies z.ZodType<UpdateNotificationSettings>

export const notificationResponseSchema = z.object({
  data: notificationSchema,
  meta: metaSchema,
}) satisfies z.ZodType<NotificationResponse>

export const notificationsListResponseSchema = z.object({
  data: z.array(notificationSchema),
  meta: metaSchema,
}) satisfies z.ZodType<NotificationsListResponse>

export const notificationSettingsResponseSchema = z.object({
  data: notificationSettingsSchema,
  meta: metaSchema,
}) satisfies z.ZodType<NotificationSettingsResponse>

const notificationUnreadCountSchema = z.object({
  total: z.number(),
}) satisfies z.ZodType<NotificationUnreadCount>

export const notificationUnreadCountResponseSchema = z.object({
  unreadCount: notificationUnreadCountSchema,
  meta: metaSchema,
}) satisfies z.ZodType<NotificationUnreadCountResponse>
