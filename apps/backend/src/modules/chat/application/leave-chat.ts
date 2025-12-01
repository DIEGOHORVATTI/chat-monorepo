import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { ChatType } from '@/modules/chat/domain/entities'

export const makeLeaveChat =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, chatId: string) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Não pode sair de chats diretos
    if (chat.type === ChatType.DIRECT) {
      throw badRequest('Cannot leave direct chats')
    }

    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant) {
      throw notFound('You are not a participant of this chat')
    }

    await participantRepository.leave(chatId, currentUserId)

    // Atualizar participantIds do chat
    const updatedChat = {
      ...chat,
      participantIds: chat.participantIds.filter((id) => id !== currentUserId),
      updatedAt: new Date(),
    }

    await chatRepository.update(updatedChat)
  }
