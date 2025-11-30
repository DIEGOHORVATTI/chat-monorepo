import type { PaginateResult } from '@/utils/paginate'
import type { MessageProps } from '@/modules/chat/domain/entities'

export interface MessageRepository {
  findById(id: string): Promise<MessageProps | null>
  findAllByChatId(
    chatId: string,
    page: number,
    limit: number
  ): Promise<PaginateResult<MessageProps>>
  save(message: MessageProps): Promise<MessageProps>
  update(message: MessageProps): Promise<MessageProps>
  delete(id: string): Promise<void>
  markAsRead(messageId: string): Promise<void>
  countUnreadByUserId(userId: string): Promise<number>
}
