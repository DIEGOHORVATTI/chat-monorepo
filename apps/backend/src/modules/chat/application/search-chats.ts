import type { ChatType } from '@/modules/chat/domain/entities'
import type { ChatRepository } from '@/modules/chat/domain/repositories'

export const makeSearchChats =
  (chatRepository: ChatRepository) =>
  async (query: string, type: ChatType | undefined, page = 1, limit = 20) =>
    chatRepository.searchByName(query, type, page, limit)
