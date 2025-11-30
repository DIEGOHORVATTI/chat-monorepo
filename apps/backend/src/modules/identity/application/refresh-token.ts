import type { UserRepository } from '@identity/domain/repositories'
import type { JwtService, RefreshTokenService } from '@repo/service-core'

import { unauthorized } from '@repo/service-core'

export const makeRefreshToken =
  (
    userRepository: UserRepository,
    jwtService: JwtService,
    refreshTokenService: RefreshTokenService
  ) =>
  async (refreshToken: string) => {
    try {
      const decoded = await refreshTokenService.verify(refreshToken)

      const user = await userRepository.findById(decoded.id)

      if (!user || !user.isActive) {
        throw unauthorized('Invalid refresh token')
      }

      const accessToken = await jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: user.permissions,
      })

      const newRefreshToken = await refreshTokenService.sign({
        id: user.id,
        email: user.email,
      })

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600, // 1 hour in seconds
        meta: {
          total: 1,
          page: 1,
          limit: 1,
          pages: 1,
        },
      }
    } catch (error) {
      throw unauthorized('Invalid or expired refresh token')
    }
  }
