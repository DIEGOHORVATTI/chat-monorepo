import type { Entity } from '@/core/domain/entity'

export interface ReactionProps extends Entity {
  messageId: string
  userId: string
  emoji: string
}

export const createReaction = (
  props: Omit<ReactionProps, 'createdAt' | 'updatedAt'>
): ReactionProps => ({
  ...props,
  createdAt: new Date(),
  updatedAt: new Date(),
})
