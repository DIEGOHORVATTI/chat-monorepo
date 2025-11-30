import type { ChatProps } from '@/modules/chat/domain/entities'

export class ChatMapper {
  static toDomain(raw: Record<string, unknown>): ChatProps {
    return {
      id: raw.id as string,
      type: raw.type as 'DIRECT' | 'GROUP',
      name: (raw.name as string) || null,
      avatarUrl: (raw.avatarUrl as string) || null,
      participantIds: (raw.participantIds as string[]) || [],
      createdBy: raw.createdBy as string,
      lastMessageAt: raw.lastMessageAt ? new Date(raw.lastMessageAt as string) : null,
      createdAt: new Date(raw.createdAt as string),
      updatedAt: new Date(raw.updatedAt as string),
    }
  }

  static toPersistence(chat: ChatProps): Record<string, unknown> {
    return {
      id: chat.id,
      type: chat.type,
      name: chat.name,
      avatarUrl: chat.avatarUrl,
      participantIds: chat.participantIds,
      createdBy: chat.createdBy,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }
  }
}
