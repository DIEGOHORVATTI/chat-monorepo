import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { createMessage } from '@/modules/chat/domain/entities'

export const makeForwardMessage =
  (
    messageRepository: MessageRepository,
    chatRepository: ChatRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, messageId: string, toChatIds: string[]) => {
    const originalMessage = await messageRepository.findById(messageId)

    if (!originalMessage) {
      throw notFound('Message not found')
    }

    // Verificar se o usuário é participante do chat original
    const originalParticipant = await participantRepository.findByChatAndUser(
      originalMessage.chatId,
      currentUserId
    )

    if (!originalParticipant) {
      throw badRequest('You are not a participant of the original chat')
    }

    // Verificar todos os chats de destino
    const chats = await Promise.all(toChatIds.map((id) => chatRepository.findById(id)))

    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i]
      if (!chat) {
        throw notFound(`Chat ${toChatIds[i]} not found`)
      }

      const participant = await participantRepository.findByChatAndUser(
        toChatIds[i]!,
        currentUserId
      )
      if (!participant) {
        throw badRequest(`You are not a participant of chat ${toChatIds[i]}`)
      }
    }

    // Criar mensagens encaminhadas
    const forwardedMessages = toChatIds.map((chatId) =>
      createMessage({
        id: crypto.randomUUID(),
        chatId,
        senderId: currentUserId,
        content: originalMessage.content,
        type: originalMessage.type,
        status: originalMessage.status,
        metadata: {
          ...originalMessage.metadata,
          forwardedFrom: originalMessage.id,
          originalSender: originalMessage.senderId,
        },
        replyToId: null,
        deletedAt: null,
      })
    )

    const savedMessages = await Promise.all(
      forwardedMessages.map((msg) => messageRepository.save(msg))
    )

    // Atualizar lastMessageAt dos chats de destino
    await Promise.all(
      toChatIds.map((chatId) => chatRepository.updateLastMessageAt(chatId, new Date()))
    )

    return savedMessages
  }
