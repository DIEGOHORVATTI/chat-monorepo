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

  async updatePrivacy(userId, privacy) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (!user) {
      throw new Error(`User with id ${userId} not found`)
    }

    const updatedPrivacy = {
      ...(user.privacy as any),
      ...privacy,
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        privacy: updatedPrivacy,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    return UserMapper.toDomain(updatedUser!)
  },

  async updateStatus(userId, status) {
    const [updatedUser] = await db
      .update(users)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`)
    }

    return UserMapper.toDomain(updatedUser)
  },

  async setCustomStatus(userId, customStatus, emoji, expiresAt) {
    const [updatedUser] = await db
      .update(users)
      .set({
        customStatus,
        customStatusEmoji: emoji,
        customStatusExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`)
    }

    return UserMapper.toDomain(updatedUser)
  },

  async clearCustomStatus(userId) {
    await db
      .update(users)
      .set({
        customStatus: null,
        customStatusEmoji: null,
        customStatusExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
  },

  async getOnlineUsers() {
    const onlineUsers = await db
      .select()
      .from(users)
      .where(eq(users.status, 'ONLINE'))
      .limit(100)

    return onlineUsers.map(UserMapper.toDomain)
  },

  async deleteUser(userId) {
    await db.delete(users).where(eq(users.id, userId))
  },
})
