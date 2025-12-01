import type { MessageRepository } from '@/modules/chat/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeMarkAsRead =
  (messageRepository: MessageRepository) => async (messageId: string) => {
    const message = await messageRepository.findById(messageId)

    if (!message) {
      throw notFound('Message not found')
    }

    await messageRepository.markAsRead(messageId)
  }
