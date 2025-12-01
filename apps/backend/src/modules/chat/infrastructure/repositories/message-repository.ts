import type { PaginateResult } from '@/utils/paginate'
import type { MessageProps } from '@/modules/chat/domain/entities'
import type { MessageRepository } from '@/modules/chat/domain/repositories'

import { db } from '@/core/infra/db'
import { paginate } from '@/utils/paginate'
import { messages } from '@/core/infra/db/schema'
import { eq, desc, count, ilike, inArray } from 'drizzle-orm'
import { MessageMapper } from '@/modules/chat/infrastructure/mappers'

export class DrizzleMessageRepository implements MessageRepository {
  async findById(id: string): Promise<MessageProps | null> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1)

    if (result.length === 0) return null

    return MessageMapper.toDomain(result[0])
  }

  async findAllByChatId(
    chatId: string,
    page: number,
    limit: number
  ): Promise<PaginateResult<MessageProps>> {
    const query = db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(desc(messages.createdAt))
      .$dynamic()

    const result = await paginate(query, page, limit)

    return {
      data: result.data.map(MessageMapper.toDomain),
      meta: result.meta,
    }
  }

  async save(message: MessageProps): Promise<MessageProps> {
    const data = MessageMapper.toPersistence(message)

    await db.insert(messages).values(data as typeof messages.$inferInsert)

    return message
  }

  async update(message: MessageProps): Promise<MessageProps> {
    const data = MessageMapper.toPersistence(message)

    await db.update(messages).set(data).where(eq(messages.id, message.id))

    return message
  }

  async delete(id: string): Promise<void> {
    await db.update(messages).set({ deletedAt: new Date() }).where(eq(messages.id, id))
  }

  async markAsRead(messageId: string): Promise<void> {
    await db.update(messages).set({ status: 'READ' }).where(eq(messages.id, messageId))
  }

  async searchByContent(
    query: string,
    chatId: string | undefined,
    page: number,
    limit: number
  ): Promise<PaginateResult<MessageProps>> {
    let dbQuery = db
      .select()
      .from(messages)
      .where(ilike(messages.content, `%${query}%`))
      .orderBy(desc(messages.createdAt))
      .$dynamic()

    if (chatId) {
      dbQuery = dbQuery.where(eq(messages.chatId, chatId))
    }

    const result = await paginate(dbQuery, page, limit)

    return {
      data: result.data.map(MessageMapper.toDomain),
      meta: result.meta,
    }
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    // Este método precisaria de uma tabela de leitura de mensagens
    // Por simplicidade, vamos retornar 0 por enquanto
    return 0
  }

  async countUnreadByChatIds(
    chatIds: string[]
  ): Promise<Array<{ chatId: string; unreadCount: number }>> {
    if (chatIds.length === 0) return []

    const result = await db
      .select({
        chatId: messages.chatId,
        unreadCount: count(),
      })
      .from(messages)
      .where(inArray(messages.chatId, chatIds))
      .groupBy(messages.chatId)

    return result.map((r) => ({
      chatId: r.chatId,
      unreadCount: r.unreadCount,
    }))
  }
}
