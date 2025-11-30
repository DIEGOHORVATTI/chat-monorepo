import type { UserRepository } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeSetCustomStatus =
  (userRepository: UserRepository) =>
  async (userId: string, customStatus: string, emoji?: string, expiresAt?: Date) => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    const updatedUser = await userRepository.setCustomStatus(userId, customStatus, emoji, expiresAt)

    return {
      status: updatedUser.status,
      customStatus: updatedUser.customStatus,
    }
  }
