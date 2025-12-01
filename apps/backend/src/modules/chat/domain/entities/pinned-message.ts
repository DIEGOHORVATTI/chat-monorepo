import type { Entity } from '@/core/domain/entity'

export interface PinnedMessageProps extends Entity {
  chatId: string
  messageId: string
  pinnedBy: string
}

export const createPinnedMessage = (
  props: Omit<PinnedMessageProps, 'createdAt' | 'updatedAt'>
): PinnedMessageProps => ({
  ...props,
  createdAt: new Date(),
  updatedAt: new Date(),
})
