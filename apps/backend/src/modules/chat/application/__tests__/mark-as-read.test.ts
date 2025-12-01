import type { MessageProps } from '@/modules/chat/domain/entities'
import type { MessageRepository } from '@/modules/chat/domain/repositories'

import { notFound } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeMarkAsRead } from '../mark-as-read'

describe('MarkAsRead Use Case', () => {
  let messageRepository: MessageRepository
  let markAsRead: ReturnType<typeof makeMarkAsRead>

  beforeEach(() => {
    messageRepository = {
      findById: async (id) =>
        id === 'message-1' ? ({ id: 'message-1', chatId: 'chat-1' } as MessageProps) : null,
      findAllByChatId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      searchByContent: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (message) => message as MessageProps,
      update: async (message) => message as MessageProps,
      delete: async () => undefined,
      markAsRead: async () => undefined,
      countUnreadByUserId: async () => 0,
      countUnreadByChatIds: async () => [],
    } as MessageRepository

    markAsRead = makeMarkAsRead(messageRepository)
  })

  it('should mark message as read successfully', async () => {
    await expect(markAsRead('message-1')).resolves.toBeUndefined()
  })

  it('should throw error when message does not exist', async () => {
    messageRepository.findById = async () => null

    await expect(markAsRead('message-999')).rejects.toThrow(notFound('Message not found'))
  })
})
