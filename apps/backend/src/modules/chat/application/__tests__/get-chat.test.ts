import type { ChatProps, ChatParticipantProps } from '@/modules/chat/domain/entities'
import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeGetChat } from '../get-chat'

describe('GetChat Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let getChat: ReturnType<typeof makeGetChat>

  beforeEach(() => {
    chatRepository = {
      findById: async (id) =>
        id === 'chat-1' ? ({ id: 'chat-1', name: 'Test Chat' } as ChatProps) : null,
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

    getChat = makeGetChat(chatRepository, participantRepository)
  })

  it('should get chat successfully', async () => {
    const result = await getChat('user-1', 'chat-1')

    expect(result.id).toBe('chat-1')
    expect(result.name).toBe('Test Chat')
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(getChat('user-1', 'chat-999')).rejects.toThrow(notFound('Chat not found'))
  })

  it('should throw error when user is not a participant', async () => {
    participantRepository.findByChatAndUser = async () => null

    await expect(getChat('user-1', 'chat-1')).rejects.toThrow(
      notFound('You are not a participant of this chat')
    )
  })
})
