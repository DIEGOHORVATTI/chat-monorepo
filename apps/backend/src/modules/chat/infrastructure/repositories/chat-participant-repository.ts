import type { ChatParticipantProps } from '@/modules/chat/domain/entities'
import type { ChatParticipantRepository } from '@/modules/chat/domain/repositories'

import { db } from '@/core/infra/db'
import { eq, and, isNull } from 'drizzle-orm'
import { chatParticipants } from '@/core/infra/db/schema'
import { ChatParticipantMapper } from '@/modules/chat/infrastructure/mappers'

export class DrizzleChatParticipantRepository implements ChatParticipantRepository {
  async findById(id: string): Promise<ChatParticipantProps | null> {
    const result = await db
      .select()
      .from(chatParticipants)
      .where(eq(chatParticipants.id, id))
      .limit(1)

    if (result.length === 0) return null

    return ChatParticipantMapper.toDomain(result[0])
  }

  async findByChatId(chatId: string): Promise<ChatParticipantProps[]> {
    const result = await db
      .select()
      .from(chatParticipants)
      .where(and(eq(chatParticipants.chatId, chatId), isNull(chatParticipants.leftAt)))

    return result.map(ChatParticipantMapper.toDomain)
  }

  async findByUserId(userId: string): Promise<ChatParticipantProps[]> {
    const result = await db
      .select()
      .from(chatParticipants)
      .where(and(eq(chatParticipants.userId, userId), isNull(chatParticipants.leftAt)))

    return result.map(ChatParticipantMapper.toDomain)
  }

  async findByChatAndUser(chatId: string, userId: string): Promise<ChatParticipantProps | null> {
    const result = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, userId),
          isNull(chatParticipants.leftAt)
        )
      )
      .limit(1)

    if (result.length === 0) return null

    return ChatParticipantMapper.toDomain(result[0])
  }

  async save(participant: ChatParticipantProps): Promise<ChatParticipantProps> {
    const data = ChatParticipantMapper.toPersistence(participant)

    await db.insert(chatParticipants).values(data as typeof chatParticipants.$inferInsert)

    return participant
  }

  async delete(id: string): Promise<void> {
    await db.delete(chatParticipants).where(eq(chatParticipants.id, id))
  }

  async leave(chatId: string, userId: string): Promise<void> {
    await db
      .update(chatParticipants)
      .set({ leftAt: new Date() })
      .where(and(eq(chatParticipants.chatId, chatId), eq(chatParticipants.userId, userId)))
  }
}
