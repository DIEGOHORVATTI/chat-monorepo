import type { EmailNotificationService } from '@/modules/identity/domain/services'
import type { UserRepository, EmailVerificationRepository } from '@identity/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import {
  createEmailVerification,
  createVerificationExpiry,
  generateVerificationCode,
} from '@identity/domain/entities'

type ResendVerificationData = {
  email: string
}

export const makeResendVerification =
  (
    userRepository: UserRepository,
    emailVerificationRepository: EmailVerificationRepository,
    emailNotificationService: EmailNotificationService
  ) =>
  async (data: ResendVerificationData) => {
    const { email } = data

    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw notFound('User not found')
    }

    if (user.isEmailVerified) {
      throw badRequest('Email already verified')
    }

    const activeVerifications = await emailVerificationRepository.findActiveByUserId(user.id)
    if (activeVerifications.length >= 3) {
      throw badRequest(
        'Too many verification codes requested. Please wait before requesting a new one.'
      )
    }

    const code = generateVerificationCode()
    const expiresAt = createVerificationExpiry()

    const emailVerification = createEmailVerification({
      userId: user.id,
      code,
      expires: expiresAt,
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await emailVerificationRepository.save(emailVerification)

    await emailNotificationService.sendVerificationEmail({ ...user, code })
  }
