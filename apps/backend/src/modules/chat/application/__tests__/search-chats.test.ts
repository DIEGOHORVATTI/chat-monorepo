import type { ChatProps } from '@/modules/chat/domain/entities'
import type { ChatRepository } from '@/modules/chat/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'
import { ChatType } from '@/modules/chat/domain/entities'

import { makeSearchChats } from '../search-chats'

describe('SearchChats Use Case', () => {
  let chatRepository: ChatRepository
  let searchChats: ReturnType<typeof makeSearchChats>

  beforeEach(() => {
    chatRepository = {
      findById: async () => null,
      findAllByUserId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      findByParticipants: async () => null,
      searchByName: async (query, type) => {
        if (query === 'test') {
          return {
            data: [
              { id: 'chat-1', name: 'Test Chat 1', type: ChatType.GROUP } as ChatProps,
              { id: 'chat-2', name: 'Test Chat 2', type: ChatType.GROUP } as ChatProps,
            ],
            meta: { total: 2, page: 1, limit: 20, pages: 1 },
          }
        }
        return { data: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } }
      },
      save: async (chat) => chat as ChatProps,
      update: async (chat) => chat as ChatProps,
      delete: async () => undefined,
      updateLastMessageAt: async () => undefined,
    } as ChatRepository

    searchChats = makeSearchChats(chatRepository)
  })

  it('should search chats successfully', async () => {
    const result = await searchChats('test', undefined, 1, 20)

    expect(result.data).toHaveLength(2)
    expect(result.data[0]?.name).toBe('Test Chat 1')
    expect(result.meta.total).toBe(2)
  })

  it('should return empty results when no matches found', async () => {
    const result = await searchChats('nonexistent', undefined, 1, 20)

    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
  })

  it('should filter by chat type', async () => {
    const result = await searchChats('test', ChatType.GROUP, 1, 20)

    expect(result.data).toHaveLength(2)
    expect(result.data[0]?.type).toBe(ChatType.GROUP)
  })
})
