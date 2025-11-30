import type { UserRepository } from '@identity/domain/repositories'

import { paginate } from '@/utils/paginate'
import { eq, and, count } from 'drizzle-orm'
import { db } from '@/core/infra/db/drizzle'
import { users, blockedUsers } from '@/core/infra/db/schema'
import { UserMapper } from '@identity/infrastructure/mappers'

export const makeUserRepository = (): UserRepository => ({
  async findByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user) return null

    return UserMapper.toDomain(user)
  },

  async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

    if (!user) return null

    return UserMapper.toDomain(user)
  },

  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit

    const [allUsers, [totalResult]] = await Promise.all([
      db.select().from(users).limit(limit).offset(offset),
      db.select({ count: count() }).from(users),
    ])

    return paginate(allUsers.map(UserMapper.toDomain), totalResult?.count ?? 0, { page, limit })
  },

  async save(user) {
    const data = UserMapper.toPersistence(user)

    await db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
  },

  async updateLastLogin(id) {
    const [updatedUser] = await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id))
      .returning()

    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`)
    }

    return UserMapper.toDomain(updatedUser)
  },

  async markEmailAsVerified(id) {
    await db
      .update(users)
      .set({
        isEmailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
  },

  async blockUser(userId, blockedUserId) {
    await db.insert(blockedUsers).values({
      userId,
      blockedUserId,
      createdAt: new Date(),
    })
  },

  async unblockUser(userId, blockedUserId) {
    await db
      .delete(blockedUsers)
      .where(and(eq(blockedUsers.userId, userId), eq(blockedUsers.blockedUserId, blockedUserId)))
  },

  async isUserBlocked(userId, blockedUserId) {
    const [result] = await db
      .select()
      .from(blockedUsers)
      .where(and(eq(blockedUsers.userId, userId), eq(blockedUsers.blockedUserId, blockedUserId)))
      .limit(1)

    return !!result
  },
})
