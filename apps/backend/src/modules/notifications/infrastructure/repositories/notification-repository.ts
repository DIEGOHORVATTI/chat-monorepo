import type { ListResponse } from '@/core/domain/entity'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { NotificationRepository } from '@/modules/notifications/domain/repositories'
import type { NotificationType, NotificationProps } from '@/modules/notifications/domain/entities'

import { eq, and, desc } from 'drizzle-orm'
import { paginate } from '@/utils/paginate'

import { NotificationMapper } from '../mappers'
import { notifications } from '../db/notifications.schema'

export class DrizzleNotificationRepository implements NotificationRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<NotificationProps | null> {
    const result = await this.db.select().from(notifications).where(eq(notifications.id, id))

    if (!result[0]) return null

    return NotificationMapper.toDomain(result[0] as Record<string, unknown>)
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
    isRead?: boolean,
    type?: NotificationType
  ): Promise<ListResponse<NotificationProps>> {
    let query = this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .$dynamic()

    // Apply filters
    const conditions = [eq(notifications.userId, userId)]

    if (isRead !== undefined) {
      conditions.push(eq(notifications.isRead, isRead))
    }

    if (type) {
      conditions.push(eq(notifications.type, type))
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions))
    }

    query = query.orderBy(desc(notifications.createdAt))

    const result = await paginate(query, page, limit)

    return {
      data: result.data.map((row) => NotificationMapper.toDomain(row as Record<string, unknown>)),
      meta: result.meta,
    }
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    const result = await this.db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

    return result.length
  }

  async save(notification: NotificationProps): Promise<NotificationProps> {
    const data = NotificationMapper.toPersistence(notification)

    const result = await this.db
      .insert(notifications)
      .values(data as typeof notifications.$inferInsert)
      .returning()

    return NotificationMapper.toDomain(result[0] as Record<string, unknown>)
  }

  async markAsRead(notificationIds: string[]): Promise<void> {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationIds[0]!))
  }

  async markAllAsReadByUserId(userId: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId))
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(notifications).where(eq(notifications.id, id))
  }
}
