import type { UserRepository } from '@identity/domain/repositories'

import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeUnblockUser } from '../unblock-user'

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

describe('UnblockUser Use Case', () => {
  let unblockUser: ReturnType<typeof makeUnblockUser>

  beforeEach(() => {
    vi.resetAllMocks()
    unblockUser = makeUnblockUser(mockUserRepository)
  })

  it('should unblock user successfully', async () => {
    // Arrange
    const userId = 'user-id-123'
    const blockedUserId = 'blocked-user-id-456'

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
    vi.spyOn(mockUserRepository, 'isUserBlocked').mockResolvedValue(true)
    vi.spyOn(mockUserRepository, 'unblockUser').mockResolvedValue()

    // Act
    await unblockUser(userId, blockedUserId)

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.isUserBlocked).toHaveBeenCalledWith(userId, blockedUserId)
    expect(mockUserRepository.unblockUser).toHaveBeenCalledWith(userId, blockedUserId)
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const userId = 'user-id-123'
    const blockedUserId = 'blocked-user-id-456'

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null)

    // Act & Assert
    await expect(unblockUser(userId, blockedUserId)).rejects.toThrow('User not found')
    expect(mockUserRepository.unblockUser).not.toHaveBeenCalled()
  })

  it('should throw error if user is not blocked', async () => {
    // Arrange
    const userId = 'user-id-123'
    const blockedUserId = 'blocked-user-id-456'

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
    vi.spyOn(mockUserRepository, 'isUserBlocked').mockResolvedValue(false)

    // Act & Assert
    await expect(unblockUser(userId, blockedUserId)).rejects.toThrow('User is not blocked')
    expect(mockUserRepository.unblockUser).not.toHaveBeenCalled()
  })
})
