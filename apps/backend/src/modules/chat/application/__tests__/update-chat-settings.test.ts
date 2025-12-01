import type {
  ChatRepository,
  ChatSettingsRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import {
  type ChatProps,
  ParticipantRole,
  type ChatSettingsProps,
  type ChatParticipantProps,
} from '@/modules/chat/domain/entities'

import { makeUpdateChatSettings } from '../update-chat-settings'

describe('UpdateChatSettings Use Case', () => {
  let chatSettingsRepository: ChatSettingsRepository
  let chatRepository: ChatRepository
  let participantRepository: ChatParticipantRepository
  let updateChatSettings: ReturnType<typeof makeUpdateChatSettings>

  beforeEach(() => {
    chatSettingsRepository = {
      findByChatId: async (chatId) =>
        chatId === 'chat-1'
          ? ({
              id: 'settings-1',
              chatId: 'chat-1',
              allowMemberInvites: true,
              allowMemberMessages: true,
              muteNotifications: false,
            } as ChatSettingsProps)
          : null,
      save: async (settings) => settings as ChatSettingsProps,
      update: async (settings) => settings as ChatSettingsProps,
    } as ChatSettingsRepository

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

    updateChatSettings = makeUpdateChatSettings(
      chatSettingsRepository,
      chatRepository,
      participantRepository
    )
  })

  it('should update chat settings successfully', async () => {
    const result = await updateChatSettings('user-1', 'chat-1', {
      description: 'New description',
      muteNotifications: true,
    })

    expect(result.description).toBe('New description')
    expect(result.muteNotifications).toBe(true)
  })

  it('should throw error when chat does not exist', async () => {
    chatRepository.findById = async () => null

    await expect(updateChatSettings('user-1', 'chat-999', { description: 'Test' })).rejects.toThrow(
      notFound('Chat not found')
    )
  })

  it('should throw error when user is not admin', async () => {
    participantRepository.findByChatAndUser = async () =>
      ({ id: 'participant-1', role: ParticipantRole.MEMBER } as ChatParticipantProps)

    await expect(updateChatSettings('user-1', 'chat-1', { description: 'Test' })).rejects.toThrow(
      forbidden('Only admins can update chat settings')
    )
  })

  it('should create settings if they do not exist', async () => {
    chatSettingsRepository.findByChatId = async () => null

    const result = await updateChatSettings('user-1', 'chat-1', {
      description: 'New description',
    })

    expect(result.description).toBe('New description')
    expect(result.chatId).toBe('chat-1')
  })
})
