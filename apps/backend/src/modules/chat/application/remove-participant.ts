import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole } from '@/modules/chat/domain/entities'

export const makeRemoveParticipant =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, chatId: string, participantId: string) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é admin
    const currentParticipant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!currentParticipant || currentParticipant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can remove participants')
    }

    const targetParticipant = await participantRepository.findById(participantId)

    if (!targetParticipant || targetParticipant.chatId !== chatId) {
      throw notFound('Participant not found in this chat')
    }

    await participantRepository.delete(participantId)

    // Atualizar participantIds do chat
    const updatedChat = {
      ...chat,
      participantIds: chat.participantIds.filter((id) => id !== targetParticipant.userId),
      updatedAt: new Date(),
    }

    await chatRepository.update(updatedChat)
  }
