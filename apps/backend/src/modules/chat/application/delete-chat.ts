import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole } from '@/modules/chat/domain/entities'

export const makeDeleteChat =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, chatId: string) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é admin
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can delete this chat')
    }

    await chatRepository.delete(chatId)
  }
