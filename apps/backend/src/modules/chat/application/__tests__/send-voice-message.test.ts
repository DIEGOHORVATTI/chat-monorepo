import type { ChatProps, MessageProps, ChatParticipantProps } from '@/modules/chat/domain/entities'
import type {
  ChatRepository,
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import { MessageType } from '@/modules/chat/domain/entities'

import { makeSendVoiceMessage } from '../send-voice-message'

describe('SendVoiceMessage Use Case', () => {
  let messageRepository: MessageRepository
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let sendVoiceMessage: ReturnType<typeof makeSendVoiceMessage>

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

    sendVoiceMessage = makeSendVoiceMessage(
      messageRepository,
      chatRepository,
      participantRepository
    )
  })

  it('should send voice message successfully', async () => {
    const result = await sendVoiceMessage('user-1', 'chat-1', {
      audioUrl: 'https://audio.url',
      duration: 120,
    })

    expect(result.type).toBe(MessageType.VOICE)
    expect(result.content).toBe('')
    expect(result.metadata?.audioUrl).toBe('https://audio.url')
    expect(result.metadata?.duration).toBe(120)
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(
      sendVoiceMessage('user-1', 'chat-999', { audioUrl: 'https://audio.url', duration: 120 })
    ).rejects.toThrow(notFound('Chat not found'))
  })

  it('should throw error when user is not a participant', async () => {
    participantRepository.findByChatAndUser = async () => null

    await expect(
      sendVoiceMessage('user-1', 'chat-1', { audioUrl: 'https://audio.url', duration: 120 })
    ).rejects.toThrow('You are not a participant of this chat')
  })
})
