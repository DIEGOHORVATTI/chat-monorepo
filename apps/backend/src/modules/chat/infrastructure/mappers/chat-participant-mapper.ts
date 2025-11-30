import type { ChatParticipantProps } from '@/modules/chat/domain/entities'

export class ChatParticipantMapper {
  static toDomain(raw: Record<string, unknown>): ChatParticipantProps {
    return {
      id: raw.id as string,
      chatId: raw.chatId as string,
      userId: raw.userId as string,
      role: raw.role as 'admin' | 'member',
      joinedAt: new Date(raw.joinedAt as string),
      leftAt: raw.leftAt ? new Date(raw.leftAt as string) : null,
    }
  }

  static toPersistence(participant: ChatParticipantProps): Record<string, unknown> {
    return {
      id: participant.id,
      chatId: participant.chatId,
      userId: participant.userId,
      role: participant.role,
      joinedAt: participant.joinedAt,
      leftAt: participant.leftAt,
    }
  }
}
