import type { PaginateResult } from '@/utils/paginate'
import type { ChatProps } from '@/modules/chat/domain/entities'
import type { ChatRepository } from '@/modules/chat/domain/repositories'

export const makeListChats =
  (chatRepository: ChatRepository) =>
  async (
    currentUserId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginateResult<ChatProps>> =>
    chatRepository.findAllByUserId(currentUserId, page, limit)
