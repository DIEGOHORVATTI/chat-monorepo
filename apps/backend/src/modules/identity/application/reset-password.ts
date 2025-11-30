import type { UserRepository, PasswordResetRepository } from '@identity/domain/repositories'

import { hash } from 'bcrypt'
import { notFound, badRequest } from '@repo/service-core'

export const makeResetPassword =
  (userRepository: UserRepository, passwordResetRepository: PasswordResetRepository) =>
  async (token: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      throw badRequest('Passwords do not match')
    }

    if (newPassword.length < 8) {
      throw badRequest('Password must be at least 8 characters long')
    }

    const passwordReset = await passwordResetRepository.findByToken(token)

    if (!passwordReset) {
      throw notFound('Invalid or expired reset token')
    }

    if (passwordReset.isUsed) {
      throw badRequest('Reset token has already been used')
    }

    if (passwordReset.expiresAt < new Date()) {
      throw badRequest('Reset token has expired')
    }

    const user = await userRepository.findById(passwordReset.userId)

    if (!user) {
      throw notFound('User not found')
    }

    const hashedPassword = await hash(newPassword, 10)
    user.password = hashedPassword

    await userRepository.save(user)
    await passwordResetRepository.markAsUsed(token)

    return { message: 'Password reset successfully' }
  }
