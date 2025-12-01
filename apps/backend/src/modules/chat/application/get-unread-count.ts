import type { ChatRepository, MessageRepository } from '@/modules/chat/domain/repositories'

export const makeGetUnreadCount =
  (messageRepository: MessageRepository, chatRepository: ChatRepository) =>
  async (currentUserId: string) => {
    const total = await messageRepository.countUnreadByUserId(currentUserId)

    // Buscar chats do usuário
    const chatsResult = await chatRepository.findAllByUserId(currentUserId, 1, 1000)
    const chatIds = chatsResult.data.map((chat) => chat.id)

    const chats = await messageRepository.countUnreadByChatIds(chatIds)

    return {
      total,
      chats,
    }
  }
