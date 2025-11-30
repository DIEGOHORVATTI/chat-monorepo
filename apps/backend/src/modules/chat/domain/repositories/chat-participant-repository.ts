import type { ChatParticipantProps } from '@/modules/chat/domain/entities'

export interface ChatParticipantRepository {
  findById(id: string): Promise<ChatParticipantProps | null>
  findByChatId(chatId: string): Promise<ChatParticipantProps[]>
  findByUserId(userId: string): Promise<ChatParticipantProps[]>
  findByChatAndUser(chatId: string, userId: string): Promise<ChatParticipantProps | null>
  save(participant: ChatParticipantProps): Promise<ChatParticipantProps>
  delete(id: string): Promise<void>
  leave(chatId: string, userId: string): Promise<void>
}
