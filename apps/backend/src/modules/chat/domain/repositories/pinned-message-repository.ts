import type { PinnedMessageProps } from '../entities'

export interface PinnedMessageRepository {
  findById(id: string): Promise<PinnedMessageProps | null>
  findByChatId(chatId: string): Promise<PinnedMessageProps[]>
  findByMessageId(messageId: string): Promise<PinnedMessageProps | null>
  save(pinnedMessage: PinnedMessageProps): Promise<PinnedMessageProps>
  delete(id: string): Promise<void>
  deleteByMessageId(messageId: string): Promise<void>
}
