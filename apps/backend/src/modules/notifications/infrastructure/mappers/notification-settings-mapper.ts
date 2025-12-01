import type { NotificationSettingsProps } from '@/modules/notifications/domain/entities'

export class NotificationSettingsMapper {
  static toDomain(raw: Record<string, unknown>): NotificationSettingsProps {
    return {
      userId: raw.userId as string,
      pushEnabled: raw.pushEnabled as boolean,
      emailEnabled: raw.emailEnabled as boolean,
      messageNotifications: raw.messageNotifications as boolean,
      mentionNotifications: raw.mentionNotifications as boolean,
      callNotifications: raw.callNotifications as boolean,
      reactionNotifications: raw.reactionNotifications as boolean,
      muteAll: raw.muteAll as boolean,
      mutedChats: raw.mutedChats as string[],
      mutedUntil: raw.mutedUntil ? new Date(raw.mutedUntil as string) : undefined,
    }
  }

  static toPersistence(settings: NotificationSettingsProps): Record<string, unknown> {
    return {
      userId: settings.userId,
      pushEnabled: settings.pushEnabled,
      emailEnabled: settings.emailEnabled,
      messageNotifications: settings.messageNotifications,
      mentionNotifications: settings.mentionNotifications,
      callNotifications: settings.callNotifications,
      reactionNotifications: settings.reactionNotifications,
      muteAll: settings.muteAll,
      mutedChats: settings.mutedChats,
      mutedUntil: settings.mutedUntil,
    }
  }
}
