import type { ChatProps, MessageProps, ChatParticipantProps } from '@/modules/chat/domain/entities'
import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeDeleteMessage } from '../delete-message'

describe('DeleteMessage Use Case', () => {
  let messageRepository: MessageRepository
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let deleteMessage: ReturnType<typeof makeDeleteMessage>

  beforeEach(() => {
    messageRepository = {
      findById: async (id) =>
        id === 'message-1'
          ? ({ id: 'message-1', chatId: 'chat-1', senderId: 'user-1' } as MessageProps)
          : null,
      findAllByChatId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      searchByContent: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
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

    deleteMessage = makeDeleteMessage(messageRepository, chatRepository, participantRepository)
  })

  it('should delete message successfully', async () => {
    await expect(deleteMessage('user-1', 'message-1')).resolves.toBeUndefined()
  })

  it('should throw error when message does not exist', async () => {
    messageRepository.findById = async () => null

    await expect(deleteMessage('user-1', 'message-999')).rejects.toThrow(
      notFound('Message not found')
    )
  })

  it('should throw error when user is not the sender', async () => {
    await expect(deleteMessage('user-2', 'message-1')).rejects.toThrow(
      forbidden('You can only delete your own messages')
    )
  })
})
