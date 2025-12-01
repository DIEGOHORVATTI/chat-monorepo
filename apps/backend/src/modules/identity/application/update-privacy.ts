import type { UserRepository, PrivacySettings } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeUpdatePrivacy =
  (userRepository: UserRepository) => async (userId: string, privacy: Partial<PrivacySettings>) => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    const updatedUser = await userRepository.updatePrivacy(userId, privacy)

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
      isEmailVerified: updatedUser.isEmailVerified,
      isActive: updatedUser.isActive,
      permissions: updatedUser.permissions,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLoginAt: updatedUser.lastLoginAt,
    }
  }
