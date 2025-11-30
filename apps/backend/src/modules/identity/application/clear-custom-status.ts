import type { UserRepository } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeClearCustomStatus = (userRepository: UserRepository) => async (userId: string) => {
  const user = await userRepository.findById(userId)

  if (!user) {
    throw notFound('User not found')
  }

  await userRepository.clearCustomStatus(userId)

  return { message: 'Custom status cleared successfully' }
}
