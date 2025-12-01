import type {
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export const makeGetMessage =
  (messageRepository: MessageRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, messageId: string) => {
    const message = await messageRepository.findById(messageId)

    if (!message) {
      throw notFound('Message not found')
    }

    // Verificar se o usuário é participante do chat
    const participant = await participantRepository.findByChatAndUser(message.chatId, currentUserId)

    if (!participant) {
      throw forbidden('You are not a participant of this chat')
    }

    return message
  }
