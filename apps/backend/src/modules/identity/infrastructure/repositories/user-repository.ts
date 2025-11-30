import type { UserRepository } from '@identity/domain/repositories'

import { eq, count } from 'drizzle-orm'
import { paginate } from '@/utils/paginate'
import { db } from '@/core/infra/db/drizzle'
import { users } from '@/core/infra/db/schema'
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
})
