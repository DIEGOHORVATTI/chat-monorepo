import type { UserRepository } from '@identity/domain/repositories'

import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeGetUserById } from '../get-user-by-id'

const mockUserRepository: UserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  updateLastLogin: vi.fn(),
  markEmailAsVerified: vi.fn(),
  blockUser: vi.fn(),
  unblockUser: vi.fn(),
  isUserBlocked: vi.fn(),
}

describe('GetUserById Use Case', () => {
  let getUserById: ReturnType<typeof makeGetUserById>

  beforeEach(() => {
    vi.resetAllMocks()
    getUserById = makeGetUserById(mockUserRepository)
  })

  it('should get user by id successfully', async () => {
    // Arrange
    const userId = 'user-id-123'

    const user = createUser({
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
    const result = await getUserById(userId)

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
    await expect(getUserById(userId)).rejects.toThrow('User not found')
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
  })
})
