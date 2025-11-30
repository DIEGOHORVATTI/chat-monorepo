import type { PaginateResult } from '@/utils/paginate'
import type { ChatProps } from '@/modules/chat/domain/entities'

export interface ChatRepository {
  findById(id: string): Promise<ChatProps | null>
  findAllByUserId(userId: string, page: number, limit: number): Promise<PaginateResult<ChatProps>>
  findByParticipants(participantIds: string[]): Promise<ChatProps | null>
  save(chat: ChatProps): Promise<ChatProps>
  update(chat: ChatProps): Promise<ChatProps>
  delete(id: string): Promise<void>
  updateLastMessageAt(chatId: string, timestamp: Date): Promise<void>
}
