import type { Meta, PaginationQuery } from '../../shared/types'

export type NotificationType =
  | 'new_message'
  | 'mention'
  | 'new_participant'
  | 'participant_left'
  | 'call_missed'
  | 'call_incoming'
  | 'reaction'
  | 'pin_message'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  data?: Record<string, unknown>
  createdAt: Date
}

export interface NotificationSettings {
  userId: string
  pushEnabled: boolean
  emailEnabled: boolean
  messageNotifications: boolean
  mentionNotifications: boolean
  callNotifications: boolean
  reactionNotifications: boolean
  muteAll: boolean
  mutedChats: string[]
  mutedUntil?: Date
}

export interface GetNotificationsQuery extends PaginationQuery {
  isRead?: boolean
  type?: NotificationType
}

export interface MarkAsRead {
  notificationIds: string[]
}

export interface UpdateNotificationSettings {
  pushEnabled?: boolean
  emailEnabled?: boolean
  messageNotifications?: boolean
  mentionNotifications?: boolean
  callNotifications?: boolean
  reactionNotifications?: boolean
  muteAll?: boolean
  mutedUntil?: Date
}

export interface NotificationResponse {
  data: Notification
  meta: Meta
}

export interface NotificationsListResponse {
  data: Notification[]
  meta: Meta
}

export interface NotificationSettingsResponse {
  data: NotificationSettings
  meta: Meta
}
