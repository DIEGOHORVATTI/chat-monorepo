import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { badRequest } from '@repo/service-core'
import {
  ChatType,
  createChat,
  ParticipantRole,
  createChatParticipant,
} from '@/modules/chat/domain/entities'

export type CreateChatData = {
  type: 'DIRECT' | 'GROUP'
  name?: string
  participantIds: string[]
}

export const makeCreateChat =
  (chatRepository: ChatRepository, participantRepository: ChatParticipantRepository) =>
  async (currentUserId: string, data: CreateChatData) => {
    const { type, name, participantIds } = data

    // Para chats diretos, validar que são apenas 2 participantes
    if (type === ChatType.DIRECT) {
      if (participantIds.length !== 1) {
        throw badRequest('Direct chats must have exactly one other participant')
      }

      // Verificar se já existe chat direto entre esses usuários
      const allParticipants = [currentUserId, ...participantIds].sort()
      const existingChat = await chatRepository.findByParticipants(allParticipants)

      if (existingChat) {
        throw badRequest('A direct chat already exists with this user')
      }
    }

    // Para chats de grupo, validar nome
    if (type === ChatType.GROUP && !name) {
      throw badRequest('Group chats must have a name')
    }

    const allParticipants = [currentUserId, ...participantIds]

    const chat = createChat({
      type,
      name: name || null,
      participantIds: allParticipants,
      createdBy: currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await chatRepository.save(chat)

    // Criar participantes
    const participants = allParticipants.map((userId, index) =>
      createChatParticipant({
        chatId: chat.id,
        userId,
        role: userId === currentUserId ? ParticipantRole.ADMIN : ParticipantRole.MEMBER,
        joinedAt: new Date(),
      })
    )

    await Promise.all(participants.map((p) => participantRepository.save(p)))

    return chat
  }
