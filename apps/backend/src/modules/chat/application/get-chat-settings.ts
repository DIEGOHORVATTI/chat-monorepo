import type { ChatSettingsRepository } from '@/modules/chat/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeGetChatSettings =
  (chatSettingsRepository: ChatSettingsRepository) => async (chatId: string) => {
    const settings = await chatSettingsRepository.findByChatId(chatId)

    if (!settings) {
      throw notFound('Chat settings not found')
    }

    return settings
  }
