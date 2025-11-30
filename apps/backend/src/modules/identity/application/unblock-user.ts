import type { UserRepository } from '@identity/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'

export const makeUnblockUser =
  (userRepository: UserRepository) => async (userId: string, blockedUserId: string) => {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw notFound('User not found')
    }

    const isBlocked = await userRepository.isUserBlocked(userId, blockedUserId)
    if (!isBlocked) {
      throw badRequest('User is not blocked')
    }

    await userRepository.unblockUser(userId, blockedUserId)
  }
