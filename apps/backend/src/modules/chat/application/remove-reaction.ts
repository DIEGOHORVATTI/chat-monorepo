import type { ReactionRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export const makeRemoveReaction =
  (reactionRepository: ReactionRepository) => async (currentUserId: string, reactionId: string) => {
    const reaction = await reactionRepository.findById(reactionId)

    if (!reaction) {
      throw notFound('Reaction not found')
    }

    // Apenas o dono da reação pode removê-la
    if (reaction.userId !== currentUserId) {
      throw forbidden('You can only remove your own reactions')
    }

    await reactionRepository.delete(reactionId)
  }
