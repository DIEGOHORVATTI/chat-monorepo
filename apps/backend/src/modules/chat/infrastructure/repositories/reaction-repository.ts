import type { ReactionProps } from '@/modules/chat/domain/entities'
import type { ReactionRepository } from '@/modules/chat/domain/repositories'

import { db } from '@/core/infra/db'
import { eq, and } from 'drizzle-orm'
import { ReactionMapper } from '@/modules/chat/infrastructure/mappers'
import { reactions } from '@/modules/chat/infrastructure/schema/reactions.schema'

export class DrizzleReactionRepository implements ReactionRepository {
  async findById(id: string): Promise<ReactionProps | null> {
    const result = await db.select().from(reactions).where(eq(reactions.id, id)).limit(1)

    if (result.length === 0) return null

    return ReactionMapper.toDomain(result[0])
  }

  async findByMessageId(messageId: string): Promise<ReactionProps[]> {
    const result = await db.select().from(reactions).where(eq(reactions.messageId, messageId))

    return result.map(ReactionMapper.toDomain)
  }

  async findByMessageAndUser(messageId: string, userId: string): Promise<ReactionProps | null> {
    const result = await db
      .select()
      .from(reactions)
      .where(and(eq(reactions.messageId, messageId), eq(reactions.userId, userId)))
      .limit(1)

    if (result.length === 0) return null

    return ReactionMapper.toDomain(result[0])
  }

  async save(reaction: ReactionProps): Promise<ReactionProps> {
    const data = ReactionMapper.toPersistence(reaction)

    await db.insert(reactions).values(data as typeof reactions.$inferInsert)

    return reaction
  }

  async delete(id: string): Promise<void> {
    await db.delete(reactions).where(eq(reactions.id, id))
  }
}
