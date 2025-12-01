import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import {
  MessageType,
  MessageStatus,
  type ChatProps,
  type MessageProps,
  type ChatParticipantProps,
} from '@/modules/chat/domain/entities'

import { makeSendMessage } from '../send-message'

describe('SendMessage Use Case', () => {
  let messageRepository: MessageRepository
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let sendMessage: ReturnType<typeof makeSendMessage>

  beforeEach(() => {
    messageRepository = {
      findById: async () => null,
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
      findById: async (id) =>
        id === 'chat-1'
          ? ({ id: 'chat-1', participantIds: ['user-1', 'user-2'] } as ChatProps)
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

    sendMessage = makeSendMessage(messageRepository, chatRepository, participantRepository)
  })

  it('should send a text message successfully', async () => {
    const result = await sendMessage('user-1', {
      chatId: 'chat-1',
      content: 'Hello, world!',
      type: MessageType.TEXT,
    })

    expect(result.chatId).toBe('chat-1')
    expect(result.senderId).toBe('user-1')
    expect(result.content).toBe('Hello, world!')
    expect(result.type).toBe(MessageType.TEXT)
    expect(result.status).toBe(MessageStatus.SENT)
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(
      sendMessage('user-1', {
        chatId: 'chat-999',
        content: 'Hello',
        type: MessageType.TEXT,
      })
    ).rejects.toThrow(notFound('Chat not found'))
  })

  it('should throw error when user is not a participant', async () => {
    participantRepository.findByChatAndUser = async () => null

    await expect(
      sendMessage('user-1', {
        chatId: 'chat-1',
        content: 'Hello',
        type: MessageType.TEXT,
      })
    ).rejects.toThrow(badRequest('You are not a participant of this chat'))
  })

  it('should send a message with reply', async () => {
    const result = await sendMessage('user-1', {
      chatId: 'chat-1',
      content: 'Reply message',
      type: MessageType.TEXT,
      replyToId: 'message-1',
    })

    expect(result.replyToId).toBe('message-1')
  })

  it('should send a message with metadata', async () => {
    const result = await sendMessage('user-1', {
      chatId: 'chat-1',
      content: 'Message with metadata',
      type: MessageType.IMAGE,
      metadata: { imageUrl: 'https://example.com/image.jpg', width: 1920, height: 1080 },
    })

    expect(result.metadata).toEqual({
      imageUrl: 'https://example.com/image.jpg',
      width: 1920,
      height: 1080,
    })
  })
})
