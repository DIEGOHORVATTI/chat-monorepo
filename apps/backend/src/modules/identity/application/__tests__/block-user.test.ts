import type { UserRepository } from '@identity/domain/repositories'

import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeBlockUser } from '../block-user'

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

describe('BlockUser Use Case', () => {
  let blockUser: ReturnType<typeof makeBlockUser>

  beforeEach(() => {
    vi.resetAllMocks()
    blockUser = makeBlockUser(mockUserRepository)
  })

  it('should block user successfully', async () => {
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

    const userToBlock = createUser({
      email: 'jane@example.com',
      name: 'Jane Doe',
      password: 'hashed-password',
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById')
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(userToBlock)
    vi.spyOn(mockUserRepository, 'isUserBlocked').mockResolvedValue(false)
    vi.spyOn(mockUserRepository, 'blockUser').mockResolvedValue()

    // Act
    await blockUser(userId, blockedUserId)

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.findById).toHaveBeenCalledWith(blockedUserId)
    expect(mockUserRepository.isUserBlocked).toHaveBeenCalledWith(userId, blockedUserId)
    expect(mockUserRepository.blockUser).toHaveBeenCalledWith(userId, blockedUserId)
  })

  it('should throw error if trying to block yourself', async () => {
    // Arrange
    const userId = 'user-id-123'

    // Act & Assert
    await expect(blockUser(userId, userId)).rejects.toThrow('You cannot block yourself')
    expect(mockUserRepository.blockUser).not.toHaveBeenCalled()
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const userId = 'user-id-123'
    const blockedUserId = 'blocked-user-id-456'

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null)

    // Act & Assert
    await expect(blockUser(userId, blockedUserId)).rejects.toThrow('User not found')
    expect(mockUserRepository.blockUser).not.toHaveBeenCalled()
  })

  it('should throw error if user to block not found', async () => {
    // Arrange
    const userId = 'user-id-123'
    const blockedUserId = 'non-existent-user'

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

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null)

    // Act & Assert
    await expect(blockUser(userId, blockedUserId)).rejects.toThrow('User to block not found')
    expect(mockUserRepository.blockUser).not.toHaveBeenCalled()
  })

  it('should throw error if user is already blocked', async () => {
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

    const userToBlock = createUser({
      email: 'jane@example.com',
      name: 'Jane Doe',
      password: 'hashed-password',
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById')
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(userToBlock)
    vi.spyOn(mockUserRepository, 'isUserBlocked').mockResolvedValue(true)

    // Act & Assert
    await expect(blockUser(userId, blockedUserId)).rejects.toThrow('User is already blocked')
    expect(mockUserRepository.blockUser).not.toHaveBeenCalled()
  })
})
