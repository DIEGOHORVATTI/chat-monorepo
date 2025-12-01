import type { PaginateResult } from '@/utils/paginate'
import type { ChatType, ChatProps } from '@/modules/chat/domain/entities'

export interface ChatRepository {
  findById(id: string): Promise<ChatProps | null>
  findAllByUserId(userId: string, page: number, limit: number): Promise<PaginateResult<ChatProps>>
  findByParticipants(participantIds: string[]): Promise<ChatProps | null>
  searchByName(
    query: string,
    type: ChatType | undefined,
    page: number,
    limit: number
  ): Promise<PaginateResult<ChatProps>>
  save(chat: ChatProps): Promise<ChatProps>
  update(chat: ChatProps): Promise<ChatProps>
  delete(id: string): Promise<void>
  updateLastMessageAt(chatId: string, timestamp: Date): Promise<void>
}
