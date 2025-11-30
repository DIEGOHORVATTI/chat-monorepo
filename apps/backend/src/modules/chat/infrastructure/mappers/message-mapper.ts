import type { MessageProps } from '@/modules/chat/domain/entities'

export class MessageMapper {
  static toDomain(raw: Record<string, unknown>): MessageProps {
    return {
      id: raw.id as string,
      chatId: raw.chatId as string,
      senderId: raw.senderId as string,
      content: raw.content as string,
      type: raw.type as 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'VOICE' | 'LOCATION',
      status: raw.status as 'SENT' | 'DELIVERED' | 'READ' | 'FAILED',
      replyToId: (raw.replyToId as string) || null,
      metadata: raw.metadata ? JSON.parse(raw.metadata as string) : undefined,
      createdAt: new Date(raw.createdAt as string),
      updatedAt: new Date(raw.updatedAt as string),
      deletedAt: raw.deletedAt ? new Date(raw.deletedAt as string) : null,
    }
  }

  static toPersistence(message: MessageProps): Record<string, unknown> {
    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      status: message.status,
      replyToId: message.replyToId,
      metadata: message.metadata ? JSON.stringify(message.metadata) : null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
    }
  }
}
