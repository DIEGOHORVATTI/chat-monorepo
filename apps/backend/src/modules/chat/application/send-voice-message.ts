import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { MessageType, createMessage, MessageStatus } from '@/modules/chat/domain/entities'

export type SendVoiceMessageData = {
  audioUrl: string
  duration: number
  waveform?: number[]
}

export const makeSendVoiceMessage =
  (
    messageRepository: MessageRepository,
    chatRepository: ChatRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, chatId: string, data: SendVoiceMessageData) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é participante
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant) {
      throw badRequest('You are not a participant of this chat')
    }

    const message = createMessage({
      id: crypto.randomUUID(),
      chatId,
      senderId: currentUserId,
      content: '', // Voice messages não têm conteúdo de texto
      type: MessageType.VOICE,
      status: MessageStatus.SENT,
      metadata: {
        audioUrl: data.audioUrl,
        duration: data.duration,
        waveform: data.waveform,
      },
      replyToId: null,
      deletedAt: null,
    })

    const savedMessage = await messageRepository.save(message)

    // Atualizar lastMessageAt do chat
    await chatRepository.updateLastMessageAt(chatId, new Date())

    return savedMessage
  }
