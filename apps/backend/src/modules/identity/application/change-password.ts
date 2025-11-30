import type { UserRepository } from '@identity/domain/repositories'

import { hash, compare } from 'bcrypt'
import { notFound, badRequest } from '@repo/service-core'

export type ChangePasswordData = {
  oldPassword: string
  newPassword: string
}

export const makeChangePassword =
  (userRepository: UserRepository) => async (userId: string, data: ChangePasswordData) => {
    const { oldPassword, newPassword } = data

    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    const isValidPassword = await compare(oldPassword, user.password)

    if (!isValidPassword) {
      throw badRequest('Current password is incorrect')
    }

    const hashedPassword = await hash(newPassword, 10)

    const updatedUser = {
      ...user,
      password: hashedPassword,
      updatedAt: new Date(),
    }

    await userRepository.save(updatedUser)
  }
