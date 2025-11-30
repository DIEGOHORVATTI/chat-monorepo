import type { PasswordResetRepository } from '@identity/domain/repositories'

import { eq, lt } from 'drizzle-orm'
import { db } from '@/core/infra/db/drizzle'
import { passwordResets } from '@/core/infra/db/schema'

export const makePasswordResetRepository = (): PasswordResetRepository => ({
  async save(passwordReset) {
    await db.insert(passwordResets).values({
      id: passwordReset.id,
      userId: passwordReset.userId,
      token: passwordReset.token,
      expiresAt: passwordReset.expiresAt,
      isUsed: passwordReset.isUsed,
      createdAt: passwordReset.createdAt,
      updatedAt: passwordReset.updatedAt,
    })
  },

  async findByToken(token) {
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.token, token))
      .limit(1)

    if (!reset) return null

    return {
      id: reset.id,
      userId: reset.userId,
      token: reset.token,
      expiresAt: reset.expiresAt,
      isUsed: reset.isUsed,
      createdAt: reset.createdAt,
      updatedAt: reset.updatedAt,
    }
  },

  async markAsUsed(token) {
    await db
      .update(passwordResets)
      .set({
        isUsed: true,
        updatedAt: new Date(),
      })
      .where(eq(passwordResets.token, token))
  },

  async deleteExpired() {
    await db.delete(passwordResets).where(lt(passwordResets.expiresAt, new Date()))
  },
})
