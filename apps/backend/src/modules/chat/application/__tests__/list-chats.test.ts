import type { ChatProps, ChatParticipantProps } from '@/modules/chat/domain/entities'
import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeListChats } from '../list-chats'

describe('ListChats Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let listChats: ReturnType<typeof makeListChats>

  beforeEach(() => {
    chatRepository = {
      findById: async () => null,
      findAllByUserId: async () => ({
        data: [
          { id: 'chat-1', name: 'Chat 1' } as ChatProps,
          { id: 'chat-2', name: 'Chat 2' } as ChatProps,
        ],
        meta: { total: 2, page: 1, limit: 20, pages: 1 },
      }),
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
      findByChatAndUser: async () => null,
      save: async (participant) => participant as ChatParticipantProps,
      delete: async () => undefined,
      leave: async () => undefined,
    } as ChatParticipantRepository

    listChats = makeListChats(chatRepository)
  })

  it('should list user chats successfully', async () => {
    const result = await listChats('user-1', 1, 20)

    expect(result.data).toHaveLength(2)
    expect(result.meta.total).toBe(2)
    expect(result.data[0]?.name).toBe('Chat 1')
  })

  it('should return empty list when user has no chats', async () => {
    chatRepository.findAllByUserId = async () => ({
      data: [],
      meta: { total: 0, page: 1, limit: 20, pages: 0 },
    })

    const result = await listChats('user-1', 1, 20)

    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
  })
})
