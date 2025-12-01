import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import {
  type ChatProps,
  ParticipantRole,
  type ChatParticipantProps,
} from '@/modules/chat/domain/entities'

import { makeUpdateChat } from '../update-chat'

describe('UpdateChat Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let updateChat: ReturnType<typeof makeUpdateChat>

  beforeEach(() => {
    chatRepository = {
      findById: async (id) =>
        id === 'chat-1' ? ({ id: 'chat-1', name: 'Old Name' } as ChatProps) : null,
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

    updateChat = makeUpdateChat(chatRepository, participantRepository)
  })

  it('should update chat name successfully', async () => {
    const result = await updateChat('user-1', 'chat-1', { name: 'New Name' })

    expect(result.name).toBe('New Name')
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(updateChat('user-1', 'chat-999', { name: 'New Name' })).rejects.toThrow(
      notFound('Chat not found')
    )
  })

  it('should throw error when user is not admin', async () => {
    participantRepository.findByChatAndUser = async () =>
      ({ id: 'participant-1', role: ParticipantRole.MEMBER } as ChatParticipantProps)

    await expect(updateChat('user-1', 'chat-1', { name: 'New Name' })).rejects.toThrow(
      forbidden('Only admins can update chat details')
    )
  })
})
