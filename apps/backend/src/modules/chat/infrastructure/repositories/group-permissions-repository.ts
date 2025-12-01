import type { GroupPermissionsProps } from '@/modules/chat/domain/entities'
import type { GroupPermissionsRepository } from '@/modules/chat/domain/repositories'

import { eq } from 'drizzle-orm'
import { db } from '@/core/infra/db'
import { GroupPermissionsMapper } from '@/modules/chat/infrastructure/mappers'
import { groupPermissions } from '@/modules/chat/infrastructure/schema/group-permissions.schema'

export class DrizzleGroupPermissionsRepository implements GroupPermissionsRepository {
  async findByChatId(chatId: string): Promise<GroupPermissionsProps | null> {
    const result = await db
      .select()
      .from(groupPermissions)
      .where(eq(groupPermissions.chatId, chatId))
      .limit(1)

    if (result.length === 0) return null

    return GroupPermissionsMapper.toDomain(result[0])
  }

  async save(permissions: GroupPermissionsProps): Promise<GroupPermissionsProps> {
    const data = GroupPermissionsMapper.toPersistence(permissions)

    await db.insert(groupPermissions).values(data as typeof groupPermissions.$inferInsert)

    return permissions
  }

  async update(permissions: GroupPermissionsProps): Promise<GroupPermissionsProps> {
    const data = GroupPermissionsMapper.toPersistence(permissions)

    await db.update(groupPermissions).set(data).where(eq(groupPermissions.id, permissions.id))

    return permissions
  }
}
