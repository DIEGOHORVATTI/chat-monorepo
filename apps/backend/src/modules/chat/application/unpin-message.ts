import type {
  PinnedMessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole } from '@/modules/chat/domain/entities'

export const makeUnpinMessage =
  (
    pinnedMessageRepository: PinnedMessageRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, messageId: string, chatId: string) => {
    const pinnedMessage = await pinnedMessageRepository.findByMessageId(messageId)

    if (!pinnedMessage || pinnedMessage.chatId !== chatId) {
      throw notFound('Pinned message not found')
    }

    // Verificar se o usuário é admin
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can unpin messages')
    }

    await pinnedMessageRepository.deleteByMessageId(messageId)
  }
