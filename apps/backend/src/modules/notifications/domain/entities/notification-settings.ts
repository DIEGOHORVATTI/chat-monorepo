export interface NotificationSettingsProps {
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

export const createNotificationSettings = (
  props: NotificationSettingsProps
): NotificationSettingsProps => ({
  ...props,
  pushEnabled: props.pushEnabled ?? true,
  emailEnabled: props.emailEnabled ?? true,
  messageNotifications: props.messageNotifications ?? true,
  mentionNotifications: props.mentionNotifications ?? true,
  callNotifications: props.callNotifications ?? true,
  reactionNotifications: props.reactionNotifications ?? true,
  muteAll: props.muteAll ?? false,
  mutedChats: props.mutedChats ?? [],
})
