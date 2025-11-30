import type { UserRepository } from '@identity/domain/repositories'

import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeGetMe } from './get-me'

const mockUserRepository: UserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  updateLastLogin: vi.fn(),
  markEmailAsVerified: vi.fn(),
}

describe('GetMe Use Case', () => {
  let getMe: ReturnType<typeof makeGetMe>

  beforeEach(() => {
    vi.resetAllMocks()
    getMe = makeGetMe(mockUserRepository)
  })

  it('should get user profile successfully', async () => {
    // Arrange
    const userId = 'user-id-123'

    const user = createUser({
      id: userId,
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(user)

    // Act
    const result = await getMe(userId)

    // Assert
    expect(result).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      permissions: user.permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    })
    expect(result).not.toHaveProperty('password')
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const userId = 'non-existent-user'

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null)

    // Act & Assert
    await expect(getMe(userId)).rejects.toThrow('User not found')
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
  })
})
