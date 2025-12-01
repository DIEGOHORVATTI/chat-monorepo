import type { PinnedMessageProps } from '@/modules/chat/domain/entities'

export class PinnedMessageMapper {
  static toDomain(raw: Record<string, unknown>): PinnedMessageProps {
    return {
      id: raw.id as string,
      chatId: raw.chatId as string,
      messageId: raw.messageId as string,
      pinnedBy: raw.pinnedBy as string,
      createdAt: new Date(raw.createdAt as string),
      updatedAt: new Date(raw.updatedAt as string),
    }
  }

  static toPersistence(pinnedMessage: PinnedMessageProps): Record<string, unknown> {
    return {
      id: pinnedMessage.id,
      chatId: pinnedMessage.chatId,
      messageId: pinnedMessage.messageId,
      pinnedBy: pinnedMessage.pinnedBy,
      createdAt: pinnedMessage.createdAt,
      updatedAt: pinnedMessage.updatedAt,
    }
  }
}
