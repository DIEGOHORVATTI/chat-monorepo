import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole } from '@/modules/chat/domain/entities'

export type UpdateChatData = {
  name?: string
  avatarUrl?: string
}

export const makeUpdateChat =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, chatId: string, data: UpdateChatData) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é admin
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can update chat details')
    }

    const updatedChat = {
      ...chat,
      ...(data.name !== undefined && { name: data.name }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      updatedAt: new Date(),
    }

    await chatRepository.update(updatedChat)

    return updatedChat
  }
