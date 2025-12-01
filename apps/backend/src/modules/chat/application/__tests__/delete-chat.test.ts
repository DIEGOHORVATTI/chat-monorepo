import type { ChatProps, MessageProps, ChatParticipantProps } from '@/modules/chat/domain/entities'
import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import { ChatType, ParticipantRole } from '@/modules/chat/domain/entities'

import { makeDeleteChat } from '../delete-chat'

describe('DeleteChat Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let messageRepository: MessageRepository
  let deleteChat: ReturnType<typeof makeDeleteChat>

  beforeEach(() => {
    chatRepository = {
      findById: async (id) =>
        id === 'chat-1'
          ? ({ id: 'chat-1', type: ChatType.GROUP, createdBy: 'user-1' } as ChatProps)
          : null,
      findAllByUserId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      findByParticipants: async () => null,
      searchByName: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (chat) => chat as ChatProps,
      update: async (chat) => chat as ChatProps,
      delete: async () => undefined,
      updateLastMessageAt: async () => undefined,
    } as ChatRepository

    participantRepository = {
      findById: async () => null,
      findByChatId: async () => [],
      findByUserId: async () => [],
      findByChatAndUser: async (chatId, userId) =>
        chatId === 'chat-1' && userId === 'user-1'
          ? ({
              id: 'participant-1',
              chatId,
              userId,
              role: ParticipantRole.ADMIN,
            } as ChatParticipantProps)
          : null,
      save: async (participant) => participant as ChatParticipantProps,
      delete: async () => undefined,
      leave: async () => undefined,
    } as ChatParticipantRepository

    messageRepository = {
      findById: async () => null,
      findAllByChatId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      searchByContent: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (message) => message as MessageProps,
      update: async (message) => message as MessageProps,
      delete: async () => undefined,
      markAsRead: async () => undefined,
      countUnreadByUserId: async () => 0,
      countUnreadByChatIds: async () => [],
    } as MessageRepository

    deleteChat = makeDeleteChat(chatRepository, participantRepository, messageRepository)
  })

  it('should delete chat successfully', async () => {
    await expect(deleteChat('user-1', 'chat-1')).resolves.toBeUndefined()
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(deleteChat('user-1', 'chat-999')).rejects.toThrow(notFound('Chat not found'))
  })

  it('should throw error when user is not admin', async () => {
    participantRepository.findByChatAndUser = async () =>
      ({ role: ParticipantRole.MEMBER } as ChatParticipantProps)

    await expect(deleteChat('user-2', 'chat-1')).rejects.toThrow(
      forbidden('Only admins can delete this chat')
    )
  })
})
