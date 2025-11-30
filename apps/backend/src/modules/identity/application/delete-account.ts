import type { UserRepository } from '@identity/domain/repositories'

import { compare } from 'bcrypt'
import { notFound, badRequest, unauthorized } from '@repo/service-core'

export const makeDeleteAccount =
  (userRepository: UserRepository) =>
  async (userId: string, password: string, confirmation: string) => {
    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      throw badRequest('Invalid confirmation. Please type DELETE_MY_ACCOUNT to confirm.')
    }

    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw unauthorized('Invalid password')
    }

    await userRepository.deleteUser(userId)

    return { message: 'Account deleted successfully' }
  }
