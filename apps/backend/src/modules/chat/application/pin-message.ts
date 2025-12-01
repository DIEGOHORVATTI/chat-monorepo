import type {
  ChatRepository,
  MessageRepository,
  PinnedMessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole, createPinnedMessage } from '@/modules/chat/domain/entities'

export const makePinMessage =
  (
    pinnedMessageRepository: PinnedMessageRepository,
    messageRepository: MessageRepository,
    chatRepository: ChatRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, messageId: string, chatId: string) => {
    const message = await messageRepository.findById(messageId)

    if (!message) {
      throw notFound('Message not found')
    }

    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se a mensagem pertence ao chat
    if (message.chatId !== chatId) {
      throw forbidden('Message does not belong to this chat')
    }

    // Verificar se o usuário é admin
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can pin messages')
    }

    // Verificar se já está pinada
    const existingPin = await pinnedMessageRepository.findByMessageId(messageId)

    if (existingPin) {
      return existingPin
    }

    const pinnedMessage = createPinnedMessage({
      id: crypto.randomUUID(),
      chatId,
      messageId,
      pinnedBy: currentUserId,
    })

    return pinnedMessageRepository.save(pinnedMessage)
  }
