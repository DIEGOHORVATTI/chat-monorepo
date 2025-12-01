import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole } from '@/modules/chat/domain/entities'

export const makeUpdateParticipantRole =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (
    currentUserId: string,
    chatId: string,
    participantId: string,
    role: 'admin' | 'member'
  ) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário atual é admin
    const currentParticipant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!currentParticipant || currentParticipant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can update participant roles')
    }

    const targetParticipant = await participantRepository.findById(participantId)

    if (!targetParticipant || targetParticipant.chatId !== chatId) {
      throw notFound('Participant not found in this chat')
    }

    const updatedParticipant = {
      ...targetParticipant,
      role: role as ParticipantRole,
      updatedAt: new Date(),
    }

    await participantRepository.save(updatedParticipant)
  }
