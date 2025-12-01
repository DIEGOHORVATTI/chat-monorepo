import type { ReactionRepository } from '@/modules/chat/domain/repositories'

export const makeGetReactions =
  (reactionRepository: ReactionRepository) => async (messageId: string) =>
    reactionRepository.findByMessageId(messageId)
