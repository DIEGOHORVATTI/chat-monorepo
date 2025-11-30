import type { users, User as DrizzleUser } from '@/core/infra/db/schema'
import type { User, UserRole, PermissionType } from '@identity/domain/entities'

export class UserMapper {
  static toDomain(raw: DrizzleUser): User {
    return {
      ...raw,
      role: raw.role as UserRole,
      permissions: raw.permissions as PermissionType[],
    }
  }

  static toPersistence(user: User): typeof users.$inferInsert {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      permissions: user.permissions,
      avatarUrl: user.avatarUrl ?? null,
      isEmailVerified: user.isEmailVerified ?? false,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt ?? null,
      timezone: user.timezone ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
