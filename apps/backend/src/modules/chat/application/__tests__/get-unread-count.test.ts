import type { ChatProps, MessageProps } from '@/modules/chat/domain/entities'
import type { ChatRepository, MessageRepository } from '@/modules/chat/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeGetUnreadCount } from '../get-unread-count'

describe('GetUnreadCount Use Case', () => {
  let messageRepository: MessageRepository
  let chatRepository: ChatRepository
  let getUnreadCount: ReturnType<typeof makeGetUnreadCount>

  beforeEach(() => {
    messageRepository = {
      findById: async () => null,
      findAllByChatId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      searchByContent: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (message) => message as MessageProps,
      update: async (message) => message as MessageProps,
      delete: async () => undefined,
      markAsRead: async () => undefined,
      countUnreadByUserId: async () => 5,
      countUnreadByChatIds: async (chatIds) =>
        chatIds.map((chatId, index) => ({
          chatId,
          unreadCount: index + 1,
        })),
    } as MessageRepository

    chatRepository = {
      findById: async () => null,
      findAllByUserId: async () => ({
        data: [{ id: 'chat-1' } as ChatProps, { id: 'chat-2' } as ChatProps],
        meta: { total: 2, page: 1, limit: 1000, pages: 1 },
      }),
      findByParticipants: async () => null,
      searchByName: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (chat) => chat as ChatProps,
      update: async (chat) => chat as ChatProps,
      delete: async () => undefined,
      updateLastMessageAt: async () => undefined,
    } as ChatRepository

    getUnreadCount = makeGetUnreadCount(messageRepository, chatRepository)
  })

  it('should get unread count successfully', async () => {
    const result = await getUnreadCount('user-1')

    expect(result.total).toBe(5)
    expect(result.chats).toHaveLength(2)
    expect(result.chats[0]?.chatId).toBe('chat-1')
    expect(result.chats[0]?.unreadCount).toBe(1)
  })
})
