import type { EmailVerification } from '@identity/domain/entities/email-verification'
import type { EmailVerificationRepository } from '@identity/domain/repositories/email-verification-repository'

import { eq, gt, and } from 'drizzle-orm'
import { db } from '@/core/infra/db/drizzle'
import { emailVerifications } from '@/core/infra/db/schema'

import { EmailVerificationMapper } from '../mappers/email-verification-mapper'

export const makeEmailVerificationRepository = (): EmailVerificationRepository => ({
  async save(emailVerification: EmailVerification): Promise<void> {
    const data = EmailVerificationMapper.toPersistence(emailVerification)

    await db
      .insert(emailVerifications)
      .values(data)
      .onConflictDoUpdate({
        target: emailVerifications.id,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
  },

  async findByUserIdAndCode(userId: string, code: string): Promise<EmailVerification | null> {
    const [emailVerification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.userId, userId),
          eq(emailVerifications.code, code),
          eq(emailVerifications.isUsed, false),
          gt(emailVerifications.expires, new Date())
        )
      )
      .limit(1)

    if (!emailVerification) {
      return null
    }

    return EmailVerificationMapper.toDomain(emailVerification)
  },

  async findActiveByUserId(userId: string): Promise<EmailVerification[]> {
    const results = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.userId, userId),
          eq(emailVerifications.isUsed, false),
          gt(emailVerifications.expires, new Date())
        )
      )

    return results.map(EmailVerificationMapper.toDomain)
  },

  async markAsUsed(id: string): Promise<void> {
    await db
      .update(emailVerifications)
      .set({
        isUsed: true,
        updatedAt: new Date(),
      })
      .where(eq(emailVerifications.id, id))
  },
})
