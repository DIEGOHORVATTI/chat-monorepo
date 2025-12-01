import type { ReactionProps } from '@/modules/chat/domain/entities'

export class ReactionMapper {
  static toDomain(raw: Record<string, unknown>): ReactionProps {
    return {
      id: raw.id as string,
      messageId: raw.messageId as string,
      userId: raw.userId as string,
      emoji: raw.emoji as string,
      createdAt: new Date(raw.createdAt as string),
      updatedAt: new Date(raw.updatedAt as string),
    }
  }

  static toPersistence(reaction: ReactionProps): Record<string, unknown> {
    return {
      id: reaction.id,
      messageId: reaction.messageId,
      userId: reaction.userId,
      emoji: reaction.emoji,
      createdAt: reaction.createdAt,
      updatedAt: reaction.updatedAt,
    }
  }
}
