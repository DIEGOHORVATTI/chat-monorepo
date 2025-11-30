import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export const makeGetChat =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, chatId: string) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é participante
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant) {
      throw forbidden('You are not a participant of this chat')
    }

    return chat
  }
