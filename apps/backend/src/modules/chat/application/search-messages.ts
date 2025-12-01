import type { ChatRepository, MessageRepository } from '@/modules/chat/domain/repositories'

export const makeSearchMessages =
  (messageRepository: MessageRepository, chatRepository: ChatRepository) =>
  async (query: string, chatId: string | undefined, page = 1, limit = 20) => {
    // Se chatId for fornecido, verificar se existe
    if (chatId) {
      const chat = await chatRepository.findById(chatId)
      if (!chat) {
        return { data: [], meta: { total: 0, page, limit, pages: 0 } }
      }
    }

    return messageRepository.searchByContent(query, chatId, page, limit)
  }
