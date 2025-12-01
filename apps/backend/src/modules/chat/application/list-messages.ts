import type { PaginateResult } from '@/utils/paginate'
import type { MessageProps } from '@/modules/chat/domain/entities'
import type {
  MessageRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { forbidden } from '@repo/service-core'

export const makeListMessages =
  (messageRepository: MessageRepository, participantRepository: ChatParticipantRepository) =>
  async (
    currentUserId: string,
    chatId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginateResult<MessageProps>> => {
    // Verificar se o usuário é participante
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)
    if (!participant) {
      throw forbidden('You are not a participant of this chat')
    }

    return messageRepository.findAllByChatId(chatId, page, limit)
  }
