import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

export const makeUnmuteChat =
  (settingsRepository: NotificationSettingsRepository) =>
  async (userId: string, chatId: string) => {
    await settingsRepository.unmuteChat(userId, chatId)
  }
