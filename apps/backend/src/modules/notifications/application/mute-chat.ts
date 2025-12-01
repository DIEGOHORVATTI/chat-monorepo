import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

export const makeMuteChat =
  (settingsRepository: NotificationSettingsRepository) =>
  async (userId: string, chatId: string) => {
    await settingsRepository.muteChat(userId, chatId)
  }
