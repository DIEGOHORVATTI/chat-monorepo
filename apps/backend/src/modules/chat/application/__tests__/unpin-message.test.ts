import type { PinnedMessageProps, ChatParticipantProps } from '@/modules/chat/domain/entities'
import type {
  PinnedMessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'
import { ParticipantRole } from '@/modules/chat/domain/entities'

import { makeUnpinMessage } from '../unpin-message'

describe('UnpinMessage Use Case', () => {
  let pinnedMessageRepository: PinnedMessageRepository
  let participantRepository: ChatParticipantRepository
  let unpinMessage: ReturnType<typeof makeUnpinMessage>

  beforeEach(() => {
    pinnedMessageRepository = {
      findById: async () => null,
      findByChatId: async () => [],
      findByMessageId: async (messageId) =>
        messageId === 'message-1'
          ? ({ id: 'pinned-1', messageId, chatId: 'chat-1' } as PinnedMessageProps)
          : null,
      save: async (pinned) => pinned as PinnedMessageProps,
      delete: async () => undefined,
      deleteByMessageId: async () => undefined,
    } as PinnedMessageRepository

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

    unpinMessage = makeUnpinMessage(pinnedMessageRepository, participantRepository)
  })

  it('should unpin message successfully', async () => {
    await expect(unpinMessage('user-1', 'message-1', 'chat-1')).resolves.toBeUndefined()
  })

  it('should throw error when message is not pinned', async () => {
    pinnedMessageRepository.findByMessageId = async () => null

    await expect(unpinMessage('user-1', 'message-999', 'chat-1')).rejects.toThrow(
      notFound('Pinned message not found')
    )
  })

  it('should throw error when user is not admin', async () => {
    participantRepository.findByChatAndUser = async () =>
      ({ role: ParticipantRole.MEMBER } as ChatParticipantProps)

    await expect(unpinMessage('user-1', 'message-1', 'chat-1')).rejects.toThrow(
      forbidden('Only admins can unpin messages')
    )
  })
})
