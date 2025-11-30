import type { EmailVerification } from '@identity/domain/entities/email-verification'
import type { EmailVerificationRepository } from '@identity/domain/repositories/email-verification-repository'

import { prisma } from '@/core/infra/db/prisma'

import { EmailVerificationMapper } from '../mappers/email-verification-mapper'

export const makeEmailVerificationRepository = (): EmailVerificationRepository => ({
  async save(emailVerification: EmailVerification): Promise<void> {
    const data = EmailVerificationMapper.toPersistence(emailVerification)
    await prisma.emailVerification.upsert({
      where: { id: emailVerification.id },
      update: data,
      create: data,
    })
  },

  async findByUserIdAndCode(userId: string, code: string): Promise<EmailVerification | null> {
    const emailVerification = await prisma.emailVerification.findFirst({
      where: {
        userId,
        code,
        isUsed: false,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!emailVerification) {
      return null
    }

    return EmailVerificationMapper.toDomain(emailVerification)
  },

  async findActiveByUserId(userId: string): Promise<EmailVerification[]> {
    const emailVerifications = await prisma.emailVerification.findMany({
      where: {
        userId,
        isUsed: false,
        expires: {
          gt: new Date(),
        },
      },
    })

    return emailVerifications.map(EmailVerificationMapper.toDomain)
  },

  async markAsUsed(id: string): Promise<void> {
    await prisma.emailVerification.update({
      where: { id },
      data: {
        isUsed: true,
        updatedAt: new Date(),
      },
    })
  },
})
