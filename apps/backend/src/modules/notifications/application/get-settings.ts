import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

import { createNotificationSettings } from '@/modules/notifications/domain/entities'

export const makeGetSettings =
  (settingsRepository: NotificationSettingsRepository) => async (userId: string) => {
    const settings = await settingsRepository.findByUserId(userId)

    if (!settings) {
      // Create default settings if not found
      const defaultSettings = createNotificationSettings({
        userId,
        pushEnabled: true,
        emailEnabled: true,
        messageNotifications: true,
        mentionNotifications: true,
        callNotifications: true,
        reactionNotifications: true,
        muteAll: false,
        mutedChats: [],
      })

      return settingsRepository.save(defaultSettings)
    }

    return settings
  }
