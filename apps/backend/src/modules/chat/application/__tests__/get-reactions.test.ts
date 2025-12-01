import type { ReactionProps } from '@/modules/chat/domain/entities'
import type { ReactionRepository } from '@/modules/chat/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeGetReactions } from '../get-reactions'

describe('GetReactions Use Case', () => {
  let reactionRepository: ReactionRepository
  let getReactions: ReturnType<typeof makeGetReactions>

  beforeEach(() => {
    reactionRepository = {
      findById: async () => null,
      findByMessageId: async (messageId) =>
        messageId === 'message-1'
          ? [
              { id: 'reaction-1', emoji: '👍', userId: 'user-1' } as ReactionProps,
              { id: 'reaction-2', emoji: '❤️', userId: 'user-2' } as ReactionProps,
            ]
          : [],
      findByMessageAndUser: async () => null,
      save: async (reaction) => reaction as ReactionProps,
      delete: async () => undefined,
    } as ReactionRepository

    getReactions = makeGetReactions(reactionRepository)
  })

  it('should get reactions for message successfully', async () => {
    const result = await getReactions('message-1')

    expect(result).toHaveLength(2)
    expect(result[0]?.emoji).toBe('👍')
    expect(result[1]?.emoji).toBe('❤️')
  })

  it('should return empty array when message has no reactions', async () => {
    const result = await getReactions('message-999')

    expect(result).toHaveLength(0)
  })
})
