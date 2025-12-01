import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'
import { notFound, forbidden, badRequest } from '@repo/service-core'
import {
  ChatType,
  type ChatProps,
  ParticipantRole,
  type ChatParticipantProps,
} from '@/modules/chat/domain/entities'

import { makeAddParticipants } from '../add-participants'

describe('AddParticipants Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let addParticipants: ReturnType<typeof makeAddParticipants>

  beforeEach(() => {
    chatRepository = {
      findById: async (id) =>
        id === 'chat-1'
          ? ({ id: 'chat-1', type: ChatType.GROUP, participantIds: ['user-1'] } as ChatProps)
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

    addParticipants = makeAddParticipants(chatRepository, participantRepository)
  })

  it('should add participants to group chat successfully', async () => {
    const result = await addParticipants('user-1', 'chat-1', {
      participantIds: ['user-2', 'user-3'],
    })

    expect(result).toHaveLength(2)
    expect(result[0]?.userId).toBe('user-2')
    expect(result[0]?.role).toBe(ParticipantRole.MEMBER)
    expect(result[1]?.userId).toBe('user-3')
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(
      addParticipants('user-1', 'chat-999', { participantIds: ['user-2'] })
    ).rejects.toThrow(notFound('Chat not found'))
  })

  it('should throw error when trying to add participants to direct chat', async () => {
    chatRepository.findById = async () => ({ id: 'chat-1', type: ChatType.DIRECT } as ChatProps)

    await expect(
      addParticipants('user-1', 'chat-1', { participantIds: ['user-2'] })
    ).rejects.toThrow(badRequest('Cannot add participants to direct chats'))
  })

  it('should throw error when user is not admin', async () => {
    participantRepository.findByChatAndUser = async () =>
      ({ id: 'participant-1', role: ParticipantRole.MEMBER } as ChatParticipantProps)

    await expect(
      addParticipants('user-1', 'chat-1', { participantIds: ['user-2'] })
    ).rejects.toThrow(forbidden('Only admins can add participants'))
  })

  it('should throw error when user is not a participant', async () => {
    participantRepository.findByChatAndUser = async () => null

    await expect(
      addParticipants('user-1', 'chat-1', { participantIds: ['user-2'] })
    ).rejects.toThrow(forbidden('Only admins can add participants'))
  })
})
