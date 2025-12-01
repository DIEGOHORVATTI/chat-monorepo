import type { ReactionProps } from '@/modules/chat/domain/entities'
import type { ReactionRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeRemoveReaction } from '../remove-reaction'

describe('RemoveReaction Use Case', () => {
  let reactionRepository: ReactionRepository
  let removeReaction: ReturnType<typeof makeRemoveReaction>

  beforeEach(() => {
    reactionRepository = {
      findById: async (id) =>
        id === 'reaction-1'
          ? ({ id: 'reaction-1', userId: 'user-1', emoji: '👍' } as ReactionProps)
          : null,
      findByMessageId: async () => [],
      findByMessageAndUser: async () => null,
      save: async (reaction) => reaction as ReactionProps,
      delete: async () => undefined,
    } as ReactionRepository

    removeReaction = makeRemoveReaction(reactionRepository)
  })

  it('should remove reaction successfully', async () => {
    await expect(removeReaction('user-1', 'reaction-1')).resolves.toBeUndefined()
  })

  it('should throw error when reaction does not exist', async () => {
    reactionRepository.findById = async () => null

    await expect(removeReaction('user-1', 'reaction-999')).rejects.toThrow(
      notFound('Reaction not found')
    )
  })

  it('should throw error when user is not the reaction owner', async () => {
    await expect(removeReaction('user-2', 'reaction-1')).rejects.toThrow(
      forbidden('You can only remove your own reactions')
    )
  })
})
