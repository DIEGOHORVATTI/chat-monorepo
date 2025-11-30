import type { UserRepository } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export type UpdateProfileData = {
  name?: string
  avatarUrl?: string
  timezone?: string
}

export const makeUpdateProfile =
  (userRepository: UserRepository) => async (userId: string, data: UpdateProfileData) => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    const updatedUser = {
      ...user,
      ...(data.name && { name: data.name }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      ...(data.timezone !== undefined && { timezone: data.timezone }),
      updatedAt: new Date(),
    }

    await userRepository.save(updatedUser)

    const { password: _, ...userWithoutPassword } = updatedUser

    return userWithoutPassword
  }
