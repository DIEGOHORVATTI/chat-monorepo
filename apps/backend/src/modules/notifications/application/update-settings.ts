import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

import { createNotificationSettings } from '@/modules/notifications/domain/entities'

export type UpdateSettingsData = {
  pushEnabled?: boolean
  emailEnabled?: boolean
  messageNotifications?: boolean
  mentionNotifications?: boolean
  callNotifications?: boolean
  reactionNotifications?: boolean
  muteAll?: boolean
  mutedUntil?: Date
}

export const makeUpdateSettings =
  (settingsRepository: NotificationSettingsRepository) =>
  async (userId: string, data: UpdateSettingsData) => {
    const existingSettings = await settingsRepository.findByUserId(userId)

    if (!existingSettings) {
      // Create new settings with provided data
      const newSettings = createNotificationSettings({
        userId,
        pushEnabled: data.pushEnabled ?? true,
        emailEnabled: data.emailEnabled ?? true,
        messageNotifications: data.messageNotifications ?? true,
        mentionNotifications: data.mentionNotifications ?? true,
        callNotifications: data.callNotifications ?? true,
        reactionNotifications: data.reactionNotifications ?? true,
        muteAll: data.muteAll ?? false,
        mutedChats: [],
        mutedUntil: data.mutedUntil,
      })

      return settingsRepository.save(newSettings)
    }

    // Update existing settings
    const updatedSettings = createNotificationSettings({
      ...existingSettings,
      ...data,
    })

    return settingsRepository.update(updatedSettings)
  }
