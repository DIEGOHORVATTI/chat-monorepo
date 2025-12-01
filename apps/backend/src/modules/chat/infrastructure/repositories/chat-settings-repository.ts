import type { ChatSettingsProps } from '@/modules/chat/domain/entities'
import type { ChatSettingsRepository } from '@/modules/chat/domain/repositories'

import { eq } from 'drizzle-orm'
import { db } from '@/core/infra/db'
import { ChatSettingsMapper } from '@/modules/chat/infrastructure/mappers'
import { chatSettings } from '@/modules/chat/infrastructure/schema/chat-settings.schema'

export class DrizzleChatSettingsRepository implements ChatSettingsRepository {
  async findByChatId(chatId: string): Promise<ChatSettingsProps | null> {
    const result = await db
      .select()
      .from(chatSettings)
      .where(eq(chatSettings.chatId, chatId))
      .limit(1)

    if (result.length === 0) return null

    return ChatSettingsMapper.toDomain(result[0])
  }

  async save(settings: ChatSettingsProps): Promise<ChatSettingsProps> {
    const data = ChatSettingsMapper.toPersistence(settings)

    await db.insert(chatSettings).values(data as typeof chatSettings.$inferInsert)

    return settings
  }

  async update(settings: ChatSettingsProps): Promise<ChatSettingsProps> {
    const data = ChatSettingsMapper.toPersistence(settings)

    await db.update(chatSettings).set(data).where(eq(chatSettings.id, settings.id))

    return settings
  }
}
