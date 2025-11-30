import type { UserRepository, EmailVerificationRepository } from '@identity/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'

export type VerifyEmailData = {
  userId: string
  code: string
}

export const makeVerifyEmail =
  (userRepository: UserRepository, emailVerificationRepository: EmailVerificationRepository) =>
  async (data: VerifyEmailData) => {
    const { userId, code } = data

    const user = await userRepository.findById(userId)
    if (!user) {
      throw notFound('User not found')
    }

    if (user.isEmailVerified) {
      throw badRequest('Email already verified')
    }

    const emailVerification = await emailVerificationRepository.findByUserIdAndCode(userId, code)
    if (!emailVerification) {
      throw badRequest('Invalid or expired verification code')
    }

    await emailVerificationRepository.markAsUsed(emailVerification.id)

    await userRepository.markEmailAsVerified(userId)
  }
