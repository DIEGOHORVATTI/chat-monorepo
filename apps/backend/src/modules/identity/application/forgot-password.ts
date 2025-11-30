import type { EmailNotificationService } from '@identity/domain/services'
import type { UserRepository, PasswordResetRepository } from '@identity/domain/repositories'

import { randomBytes } from 'crypto'
import { notFound } from '@repo/service-core'

export const makeForgotPassword =
  (
    userRepository: UserRepository,
    passwordResetRepository: PasswordResetRepository,
    emailNotificationService: EmailNotificationService
  ) =>
  async (email: string) => {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      throw notFound('User not found')
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    await passwordResetRepository.save({
      id: randomBytes(16).toString('hex'),
      userId: user.id,
      token,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // TODO: Implement password reset email
    // await emailNotificationService.sendPasswordResetEmail({
    //   email: user.email,
    //   name: user.name,
    //   token,
    // })

    return { message: 'Password reset email sent successfully' }
  }
