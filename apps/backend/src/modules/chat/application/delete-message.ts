import type { MessageRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export const makeDeleteMessage =
  (messageRepository: MessageRepository) => async (currentUserId: string, messageId: string) => {
    const message = await messageRepository.findById(messageId)

    if (!message) {
      throw notFound('Message not found')
    }

    // Apenas o remetente pode deletar a mensagem
    if (message.senderId !== currentUserId) {
      throw forbidden('You can only delete your own messages')
    }

    await messageRepository.delete(messageId)
  }
