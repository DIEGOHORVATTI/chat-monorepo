import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden, badRequest } from '@repo/service-core'
import { ChatType, ParticipantRole, createChatParticipant } from '@/modules/chat/domain/entities'

export type AddParticipantsData = {
  participantIds: string[]
}

export const makeAddParticipants =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, chatId: string, data: AddParticipantsData) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Apenas chats de grupo podem adicionar participantes
    if (chat.type !== ChatType.GROUP) {
      throw badRequest('Cannot add participants to direct chats')
    }

    // Verificar se o usuário é admin
    const currentParticipant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!currentParticipant || currentParticipant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can add participants')
    }

    const newParticipants = data.participantIds.map((userId) =>
      createChatParticipant({
        chatId,
        userId,
        role: ParticipantRole.MEMBER,
        joinedAt: new Date(),
      })
    )

    await Promise.all(newParticipants.map((p) => participantRepository.save(p)))

    // Atualizar participantIds do chat
    const updatedChat = {
      ...chat,
      participantIds: [...chat.participantIds, ...data.participantIds],
      updatedAt: new Date(),
    }

    await chatRepository.update(updatedChat)

    return newParticipants
  }
