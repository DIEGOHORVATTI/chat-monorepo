import type {
  ChatProps,
  MessageProps,
  PinnedMessageProps,
  ChatParticipantProps,
} from '@/modules/chat/domain/entities'
import type {
  ChatRepository,
  MessageRepository,
  PinnedMessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import { ParticipantRole } from '@/modules/chat/domain/entities'

import { makePinMessage } from '../pin-message'

describe('PinMessage Use Case', () => {
  let pinnedMessageRepository: PinnedMessageRepository
  let messageRepository: MessageRepository
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let pinMessage: ReturnType<typeof makePinMessage>

  beforeEach(() => {
    pinnedMessageRepository = {
      findById: async () => null,
      findByChatId: async () => [],
      findByMessageId: async () => null,
      save: async (pinned) => pinned as PinnedMessageProps,
      delete: async () => undefined,
      deleteByMessageId: async () => undefined,
    } as PinnedMessageRepository

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

    pinMessage = makePinMessage(
      pinnedMessageRepository,
      messageRepository,
      chatRepository,
      participantRepository
    )
  })

  it('should pin message successfully', async () => {
    const result = await pinMessage('user-1', 'message-1', 'chat-1')

    expect(result.chatId).toBe('chat-1')
    expect(result.messageId).toBe('message-1')
    expect(result.pinnedBy).toBe('user-1')
  })

  it('should throw error when message does not exist', async () => {
    messageRepository.findById = async () => null

    await expect(pinMessage('user-1', 'message-999', 'chat-1')).rejects.toThrow(
      notFound('Message not found')
    )
  })

  it('should throw error when user is not admin', async () => {
    participantRepository.findByChatAndUser = async () =>
      ({ role: ParticipantRole.MEMBER } as ChatParticipantProps)

    await expect(pinMessage('user-1', 'message-1', 'chat-1')).rejects.toThrow(
      forbidden('Only admins can pin messages')
    )
  })
})
