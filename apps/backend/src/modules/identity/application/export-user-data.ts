import type { UserRepository } from '@identity/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeExportUserData =
  (userRepository: UserRepository) => async (userId: string, format: 'json' | 'csv' = 'json') => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw notFound('User not found')
    }

    // In a real implementation, this would generate a file and upload to S3/cloud storage
    // For now, we'll return a mock URL
    const downloadUrl = `https://example.com/exports/${userId}-${Date.now()}.${format}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    return {
      downloadUrl,
      expiresAt,
      meta: {
        total: 1,
        page: 1,
        limit: 1,
        pages: 1,
      },
    }
  }
