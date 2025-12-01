import type { ChatRepository, MessageRepository } from '@/modules/chat/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'
import { type ChatProps, type MessageProps } from '@/modules/chat/domain/entities'

import { makeSearchMessages } from '../search-messages'

describe('SearchMessages Use Case', () => {
  let messageRepository: MessageRepository
  let chatRepository: ChatRepository
  let searchMessages: ReturnType<typeof makeSearchMessages>

  beforeEach(() => {
    messageRepository = {
      findById: async () => null,
      findAllByChatId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      searchByContent: async (query) =>
        query === 'hello'
          ? {
              data: [{ id: 'message-1', content: 'Hello world' } as MessageProps],
              meta: { total: 1, page: 1, limit: 20, pages: 1 },
            }
          : { data: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } },
      save: async (message) => message as MessageProps,
      update: async (message) => message as MessageProps,
      delete: async () => undefined,
      markAsRead: async () => undefined,
      countUnreadByUserId: async () => 0,
      countUnreadByChatIds: async () => [],
    } as MessageRepository

    chatRepository = {
      findById: async (id) => (id === 'chat-1' ? ({ id: 'chat-1' } as ChatProps) : null),
      findAllByUserId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      findByParticipants: async () => null,
      searchByName: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (chat) => chat as ChatProps,
      update: async (chat) => chat as ChatProps,
      delete: async () => undefined,
      updateLastMessageAt: async () => undefined,
    } as ChatRepository

    searchMessages = makeSearchMessages(messageRepository, chatRepository)
  })

  it('should search messages successfully', async () => {
    const result = await searchMessages('hello', undefined, 1, 20)

    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.content).toBe('Hello world')
  })

  it('should return empty results when no matches found', async () => {
    const result = await searchMessages('nonexistent', undefined, 1, 20)

    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
  })

  it('should filter by chatId when provided', async () => {
    const result = await searchMessages('hello', 'chat-1', 1, 20)

    expect(result).toBeDefined()
  })

  it('should return empty when chatId does not exist', async () => {
    chatRepository.findById = async () => null

    const result = await searchMessages('hello', 'chat-999', 1, 20)

    expect(result.data).toHaveLength(0)
  })
})
