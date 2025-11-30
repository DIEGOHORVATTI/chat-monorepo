import type { UserRepository } from '@identity/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'

export const makeBlockUser =
  (userRepository: UserRepository) => async (userId: string, blockedUserId: string) => {
    if (userId === blockedUserId) {
      throw badRequest('You cannot block yourself')
    }

    const user = await userRepository.findById(userId)
    if (!user) {
      throw notFound('User not found')
    }

    const blockedUser = await userRepository.findById(blockedUserId)
    if (!blockedUser) {
      throw notFound('User to block not found')
    }

    const isAlreadyBlocked = await userRepository.isUserBlocked(userId, blockedUserId)
    if (isAlreadyBlocked) {
      throw badRequest('User is already blocked')
    }

    await userRepository.blockUser(userId, blockedUserId)
  }
