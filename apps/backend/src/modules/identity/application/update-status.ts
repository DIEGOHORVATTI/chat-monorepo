import type { UserStatus, UserRepository } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeUpdateStatus =
  (userRepository: UserRepository) => async (userId: string, status: UserStatus) => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    const updatedUser = await userRepository.updateStatus(userId, status)

    return {
      status: updatedUser.status,
      customStatus: updatedUser.customStatus,
    }
  }
