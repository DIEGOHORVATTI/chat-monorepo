import type { MessageRepository } from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export type UpdateMessageData = {
  content: string
}

export const makeUpdateMessage =
  (messageRepository: MessageRepository) =>
  async (currentUserId: string, messageId: string, data: UpdateMessageData) => {
    const message = await messageRepository.findById(messageId)

    if (!message) {
      throw notFound('Message not found')
    }

    // Apenas o remetente pode editar a mensagem
    if (message.senderId !== currentUserId) {
      throw forbidden('You can only edit your own messages')
    }

    const updatedMessage = {
      ...message,
      content: data.content,
      updatedAt: new Date(),
    }

    await messageRepository.update(updatedMessage)

    return updatedMessage
  }
