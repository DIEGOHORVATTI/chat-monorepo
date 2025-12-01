import type { PinnedMessageProps } from '@/modules/chat/domain/entities'
import type { PinnedMessageRepository } from '@/modules/chat/domain/repositories'

import { eq } from 'drizzle-orm'
import { db } from '@/core/infra/db'
import { PinnedMessageMapper } from '@/modules/chat/infrastructure/mappers'
import { pinnedMessages } from '@/modules/chat/infrastructure/schema/pinned-messages.schema'

export class DrizzlePinnedMessageRepository implements PinnedMessageRepository {
  async findById(id: string): Promise<PinnedMessageProps | null> {
    const result = await db.select().from(pinnedMessages).where(eq(pinnedMessages.id, id)).limit(1)

    if (result.length === 0) return null

    return PinnedMessageMapper.toDomain(result[0])
  }

  async findByChatId(chatId: string): Promise<PinnedMessageProps[]> {
    const result = await db.select().from(pinnedMessages).where(eq(pinnedMessages.chatId, chatId))

    return result.map(PinnedMessageMapper.toDomain)
  }

  async findByMessageId(messageId: string): Promise<PinnedMessageProps | null> {
    const result = await db
      .select()
      .from(pinnedMessages)
      .where(eq(pinnedMessages.messageId, messageId))
      .limit(1)

    if (result.length === 0) return null

    return PinnedMessageMapper.toDomain(result[0])
  }

  async save(pinnedMessage: PinnedMessageProps): Promise<PinnedMessageProps> {
    const data = PinnedMessageMapper.toPersistence(pinnedMessage)

    await db.insert(pinnedMessages).values(data as typeof pinnedMessages.$inferInsert)

    return pinnedMessage
  }

  async delete(id: string): Promise<void> {
    await db.delete(pinnedMessages).where(eq(pinnedMessages.id, id))
  }

  async deleteByMessageId(messageId: string): Promise<void> {
    await db.delete(pinnedMessages).where(eq(pinnedMessages.messageId, messageId))
  }
}
