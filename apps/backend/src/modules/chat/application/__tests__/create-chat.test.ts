import type { ChatRepository, ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { badRequest } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import { ChatType, type ChatProps, type ChatParticipantProps } from '@/modules/chat/domain/entities'

import { makeCreateChat } from '../create-chat'

describe('CreateChat Use Case', () => {
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let createChat: ReturnType<typeof makeCreateChat>

  beforeEach(() => {
    chatRepository = {
      findById: async () => null,
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
      findByChatAndUser: async () => null,
      save: async (participant) => participant as ChatParticipantProps,
      delete: async () => undefined,
      leave: async () => undefined,
    } as ChatParticipantRepository

    createChat = makeCreateChat(chatRepository, participantRepository)
  })

  it('should create a direct chat successfully', async () => {
    const result = await createChat('user-1', {
      type: ChatType.DIRECT,
      participantIds: ['user-2'],
    })

    expect(result.type).toBe(ChatType.DIRECT)
    expect(result.participantIds).toEqual(['user-1', 'user-2'])
    expect(result.createdBy).toBe('user-1')
    expect(result.name).toBeNull()
  })

  it('should create a group chat with name successfully', async () => {
    const result = await createChat('user-1', {
      type: ChatType.GROUP,
      name: 'Team Chat',
      participantIds: ['user-2', 'user-3'],
    })

    expect(result.type).toBe(ChatType.GROUP)
    expect(result.name).toBe('Team Chat')
    expect(result.participantIds).toEqual(['user-1', 'user-2', 'user-3'])
    expect(result.createdBy).toBe('user-1')
  })

  it('should throw error when direct chat has more than one participant', async () => {
    await expect(
      createChat('user-1', {
        type: ChatType.DIRECT,
        participantIds: ['user-2', 'user-3'],
      })
    ).rejects.toThrow(badRequest('Direct chats must have exactly one other participant'))
  })

  it('should throw error when direct chat already exists', async () => {
    chatRepository.findByParticipants = async () => ({ id: 'chat-1' } as ChatProps)

    await expect(
      createChat('user-1', {
        type: ChatType.DIRECT,
        participantIds: ['user-2'],
      })
    ).rejects.toThrow(badRequest('A direct chat already exists with this user'))
  })

  it('should throw error when group chat has no name', async () => {
    await expect(
      createChat('user-1', {
        type: ChatType.GROUP,
        participantIds: ['user-2', 'user-3'],
      })
    ).rejects.toThrow(badRequest('Group chats must have a name'))
  })

  it('should include current user as admin in participants', async () => {
    const savedParticipants: ChatParticipantProps[] = []
    participantRepository.save = async (participant) => {
      savedParticipants.push(participant)
      return participant as ChatParticipantProps
    }

    await createChat('user-1', {
      type: ChatType.GROUP,
      name: 'Test Group',
      participantIds: ['user-2'],
    })

    expect(savedParticipants).toHaveLength(2)
    const adminParticipant = savedParticipants.find((p) => p.userId === 'user-1')
    expect(adminParticipant?.role).toBe('admin')
  })
})
