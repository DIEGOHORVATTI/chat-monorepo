import type { UserRepository } from '@identity/domain/repositories'

import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeUpdateProfile } from '../update-profile'

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

describe('UpdateProfile Use Case', () => {
  let updateProfile: ReturnType<typeof makeUpdateProfile>

  beforeEach(() => {
    vi.resetAllMocks()
    updateProfile = makeUpdateProfile(mockUserRepository)
  })

  it('should update profile successfully', async () => {
    // Arrange
    const userId = 'user-id-123'
    const updateData = {
      name: 'John Updated',
      avatarUrl: 'https://example.com/avatar.jpg',
      timezone: 'America/Sao_Paulo',
    }

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
    vi.spyOn(mockUserRepository, 'save').mockResolvedValue()

    // Act
    const result = await updateProfile(userId, updateData)

    // Assert
    expect(result.name).toBe(updateData.name)
    expect(result.avatarUrl).toBe(updateData.avatarUrl)
    expect(result.timezone).toBe(updateData.timezone)
    expect(result).not.toHaveProperty('password')
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
  })

  it('should update only provided fields', async () => {
    // Arrange
    const userId = 'user-id-123'
    const updateData = {
      name: 'John Updated',
    }

    const user = createUser({
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed-password',
      avatarUrl: 'https://example.com/old-avatar.jpg',
      timezone: 'UTC',
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(user)
    vi.spyOn(mockUserRepository, 'save').mockResolvedValue()

    // Act
    const result = await updateProfile(userId, updateData)

    // Assert
    expect(result.name).toBe(updateData.name)
    expect(result.avatarUrl).toBe(user.avatarUrl) // Should remain unchanged
    expect(result.timezone).toBe(user.timezone) // Should remain unchanged
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const userId = 'non-existent-user'
    const updateData = { name: 'New Name' }

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null)

    // Act & Assert
    await expect(updateProfile(userId, updateData)).rejects.toThrow('User not found')
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })
})
