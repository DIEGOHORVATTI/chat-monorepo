import type { User, UserRole, PermissionType } from '@identity/domain/entities'
import type { User as PrismaUser, PermissionType as PrismaPermissionType } from '@prisma/client'

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return {
      ...raw,
      role: raw.role as UserRole,
      permissions: raw.permissions as PermissionType[],
    }
  }

  static toPersistence(user: User): PrismaUser {
    return {
      ...user,
      avatarUrl: user.avatarUrl ?? null,
      isEmailVerified: user.isEmailVerified ?? false,
      lastLoginAt: user.lastLoginAt ?? null,
      timezone: user.timezone ?? null,
      permissions: user.permissions as PrismaPermissionType[],
    }
  }
}
