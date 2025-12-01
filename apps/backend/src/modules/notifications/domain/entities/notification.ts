export type NotificationType =
  | 'new_message'
  | 'mention'
  | 'new_participant'
  | 'participant_left'
  | 'call_missed'
  | 'call_incoming'
  | 'reaction'
  | 'pin_message'

export interface NotificationProps {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  data?: Record<string, unknown>
  createdAt: Date
}

export const createNotification = (props: NotificationProps): NotificationProps => ({
  ...props,
  isRead: props.isRead ?? false,
  createdAt: props.createdAt ?? new Date(),
})
