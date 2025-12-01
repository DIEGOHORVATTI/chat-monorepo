import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { MessageType, createMessage, MessageStatus } from '@/modules/chat/domain/entities'

export type SendMessageData = {
  chatId: string
  content: string
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'VOICE' | 'LOCATION'
  replyToId?: string
  metadata?: Record<string, unknown>
}

export const makeSendMessage =
  (
    messageRepository: MessageRepository,
    chatRepository: ChatRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, data: SendMessageData) => {
    const { chatId, content, type = MessageType.TEXT, replyToId, metadata } = data

    // Verificar se o chat existe
    const chat = await chatRepository.findById(chatId)
    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é participante
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)
    if (!participant) {
      throw forbidden('You are not a participant of this chat')
    }

    const message = createMessage({
      chatId,
      senderId: currentUserId,
      content,
      type,
      status: MessageStatus.SENT,
      replyToId: replyToId || null,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await messageRepository.save(message)

    // Atualizar última mensagem do chat
    await chatRepository.updateLastMessageAt(chatId, message.createdAt)

    return message
  }
