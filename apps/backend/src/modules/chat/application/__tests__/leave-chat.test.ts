import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import { ChatType, type ChatProps, type ChatParticipantProps } from '@/modules/chat/domain/entities'

import { makeLeaveChat } from '../leave-chat'

describe('LeaveChat Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let leaveChat: ReturnType<typeof makeLeaveChat>

  beforeEach(() => {
    chatRepository = {
      findById: async (id) =>
        id === 'chat-1'
          ? ({
              id: 'chat-1',
              type: ChatType.GROUP,
              participantIds: ['user-1', 'user-2'],
            } as ChatProps)
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
          ? ({ id: 'participant-1', chatId, userId } as ChatParticipantProps)
          : null,
      save: async (participant) => participant as ChatParticipantProps,
      delete: async () => undefined,
      leave: async () => undefined,
    } as ChatParticipantRepository

    leaveChat = makeLeaveChat(chatRepository, participantRepository)
  })

  it('should leave group chat successfully', async () => {
    await expect(leaveChat('user-1', 'chat-1')).resolves.toBeUndefined()
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(leaveChat('user-1', 'chat-999')).rejects.toThrow(notFound('Chat not found'))
  })

  it('should throw error when trying to leave direct chat', async () => {
    chatRepository.findById = async () => ({ id: 'chat-1', type: ChatType.DIRECT } as ChatProps)

    await expect(leaveChat('user-1', 'chat-1')).rejects.toThrow(
      badRequest('Cannot leave direct chats')
    )
  })

  it('should throw error when user is not a participant', async () => {
    participantRepository.findByChatAndUser = async () => null

    await expect(leaveChat('user-1', 'chat-1')).rejects.toThrow(
      notFound('You are not a participant of this chat')
    )
  })
})
