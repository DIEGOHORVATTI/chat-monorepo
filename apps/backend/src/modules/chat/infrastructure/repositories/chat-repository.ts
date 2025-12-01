import type { PaginateResult } from '@/utils/paginate'
import type { ChatRepository } from '@/modules/chat/domain/repositories'
import type { ChatType, ChatProps } from '@/modules/chat/domain/entities'

import { db } from '@/core/infra/db'
import { paginate } from '@/utils/paginate'
import { chats } from '@/core/infra/db/schema'
import { eq, and, ilike, inArray } from 'drizzle-orm'
import { ChatMapper } from '@/modules/chat/infrastructure/mappers'

export class DrizzleChatRepository implements ChatRepository {
  async findById(id: string): Promise<ChatProps | null> {
    const result = await db.select().from(chats).where(eq(chats.id, id)).limit(1)

    if (result.length === 0) return null

    return ChatMapper.toDomain(result[0])
  }

  async findAllByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginateResult<ChatProps>> {
    const query = db.select().from(chats).where(inArray(userId, chats.participantIds)).$dynamic()

    const result = await paginate(query, page, limit)

    return {
      data: result.data.map(ChatMapper.toDomain),
      meta: result.meta,
    }
  }

  async findByParticipants(participantIds: string[]): Promise<ChatProps | null> {
    const sortedIds = [...participantIds].sort()

    const result = await db
      .select()
      .from(chats)
      .where(and(eq(chats.type, 'DIRECT'), eq(chats.participantIds.length, sortedIds.length)))
      .limit(100)

    const chat = result.find((c) => {
      const chatIds = [...(c.participantIds || [])].sort()
      return JSON.stringify(chatIds) === JSON.stringify(sortedIds)
    })

    if (!chat) return null

    return ChatMapper.toDomain(chat)
  }

  async save(chat: ChatProps): Promise<ChatProps> {
    const data = ChatMapper.toPersistence(chat)

    await db.insert(chats).values(data as typeof chats.$inferInsert)

    return chat
  }

  async update(chat: ChatProps): Promise<ChatProps> {
    const data = ChatMapper.toPersistence(chat)

    await db.update(chats).set(data).where(eq(chats.id, chat.id))

    return chat
  }

  async delete(id: string): Promise<void> {
    await db.delete(chats).where(eq(chats.id, id))
  }

  async searchByName(
    query: string,
    type: ChatType | undefined,
    page: number,
    limit: number
  ): Promise<PaginateResult<ChatProps>> {
    let dbQuery = db
      .select()
      .from(chats)
      .where(ilike(chats.name, `%${query}%`))
      .$dynamic()

    if (type) {
      dbQuery = dbQuery.where(eq(chats.type, type))
    }

    const result = await paginate(dbQuery, page, limit)

    return {
      data: result.data.map(ChatMapper.toDomain),
      meta: result.meta,
    }
  }

  async updateLastMessageAt(chatId: string, timestamp: Date): Promise<void> {
    await db.update(chats).set({ lastMessageAt: timestamp }).where(eq(chats.id, chatId))
  }
}
