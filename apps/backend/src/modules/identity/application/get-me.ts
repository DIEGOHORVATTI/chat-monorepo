import type { User } from '@identity/domain/entities'
import type { UserRepository } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeGetMe =
  (userRepository: UserRepository) =>
  async (userId: string): Promise<Omit<User, 'password'>> => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
