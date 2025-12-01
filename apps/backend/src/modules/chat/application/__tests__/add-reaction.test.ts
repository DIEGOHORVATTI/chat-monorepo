import type {
  MessageProps,
  ReactionProps,
  ChatParticipantProps,
} from '@/modules/chat/domain/entities'
import type {
  MessageRepository,
  ReactionRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeAddReaction } from '../add-reaction'

describe('AddReaction Use Case', () => {
  let reactionRepository: ReactionRepository
  let messageRepository: MessageRepository
  let participantRepository: ChatParticipantRepository
  let addReaction: ReturnType<typeof makeAddReaction>

  beforeEach(() => {
    reactionRepository = {
      findById: async () => null,
      findByMessageId: async () => [],
      findByMessageAndUser: async () => null,
      save: async (reaction) => reaction as ReactionProps,
      delete: async () => undefined,
    } as ReactionRepository

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

    addReaction = makeAddReaction(reactionRepository, messageRepository, participantRepository)
  })

  it('should add reaction to message successfully', async () => {
    const result = await addReaction('user-1', 'message-1', '👍')

    expect(result.messageId).toBe('message-1')
    expect(result.userId).toBe('user-1')
    expect(result.emoji).toBe('👍')
  })

  it('should throw error when message does not exist', async () => {
    messageRepository.findById = async () => null

    await expect(addReaction('user-1', 'message-999', '👍')).rejects.toThrow(
      notFound('Message not found')
    )
  })

  it('should throw error when user is not a participant', async () => {
    participantRepository.findByChatAndUser = async () => null

    await expect(addReaction('user-1', 'message-1', '👍')).rejects.toThrow(
      badRequest('You are not a participant of this chat')
    )
  })

  it('should throw error when reaction already exists', async () => {
    reactionRepository.findByMessageAndUser = async () =>
      ({ id: 'reaction-1', emoji: '👍' } as ReactionProps)

    await expect(addReaction('user-1', 'message-1', '👍')).rejects.toThrow(
      badRequest('You already reacted with this emoji')
    )
  })
})
