import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { NotificationSettingsProps } from '@/modules/notifications/domain/entities'
import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

import { eq, sql } from 'drizzle-orm'

import { NotificationSettingsMapper } from '../mappers'
import { notificationSettings } from '../db/notification-settings.schema'

export class DrizzleNotificationSettingsRepository implements NotificationSettingsRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findByUserId(userId: string): Promise<NotificationSettingsProps | null> {
    const result = await this.db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId))

    if (!result[0]) return null

    return NotificationSettingsMapper.toDomain(result[0] as Record<string, unknown>)
  }

  async save(settings: NotificationSettingsProps): Promise<NotificationSettingsProps> {
    const data = NotificationSettingsMapper.toPersistence(settings)

    const result = await this.db
      .insert(notificationSettings)
      .values(data as typeof notificationSettings.$inferInsert)
      .returning()

    return NotificationSettingsMapper.toDomain(result[0] as Record<string, unknown>)
  }

  async update(settings: NotificationSettingsProps): Promise<NotificationSettingsProps> {
    const data = NotificationSettingsMapper.toPersistence(settings)

    const result = await this.db
      .update(notificationSettings)
      .set(data)
      .where(eq(notificationSettings.userId, settings.userId))
      .returning()

    return NotificationSettingsMapper.toDomain(result[0] as Record<string, unknown>)
  }

  async muteChat(userId: string, chatId: string): Promise<void> {
    const current = await this.findByUserId(userId)

    if (!current) {
      // Create settings with muted chat
      await this.save({
        userId,
        pushEnabled: true,
        emailEnabled: true,
        messageNotifications: true,
        mentionNotifications: true,
        callNotifications: true,
        reactionNotifications: true,
        muteAll: false,
        mutedChats: [chatId],
      })
      return
    }

    // Add chatId to mutedChats if not already present
    if (!current.mutedChats.includes(chatId)) {
      await this.db
        .update(notificationSettings)
        .set({
          mutedChats: sql`array_append(${notificationSettings.mutedChats}, ${chatId})`,
        })
        .where(eq(notificationSettings.userId, userId))
    }
  }

  async unmuteChat(userId: string, chatId: string): Promise<void> {
    await this.db
      .update(notificationSettings)
      .set({
        mutedChats: sql`array_remove(${notificationSettings.mutedChats}, ${chatId})`,
      })
      .where(eq(notificationSettings.userId, userId))
  }
}
