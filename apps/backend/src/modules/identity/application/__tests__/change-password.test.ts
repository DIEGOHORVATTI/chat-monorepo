import type { UserRepository } from '@identity/domain/repositories'

import { hash } from 'bcrypt'
import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeChangePassword } from '../change-password'

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

describe('ChangePassword Use Case', () => {
  let changePassword: ReturnType<typeof makeChangePassword>

  beforeEach(() => {
    vi.resetAllMocks()
    changePassword = makeChangePassword(mockUserRepository)
  })

  it('should change password successfully', async () => {
    // Arrange
    const userId = 'user-id-123'
    const changeData = {
      oldPassword: 'password123',
      newPassword: 'newPassword456',
    }

    // Create a real bcrypt hash for 'password123'
    const hashedPassword = await hash('password123', 10)

    const user = createUser({
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(user)
    vi.spyOn(mockUserRepository, 'save').mockResolvedValue()

    // Act
    await changePassword(userId, changeData)

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const userId = 'non-existent-user'
    const changeData = {
      oldPassword: 'password123',
      newPassword: 'newPassword456',
    }

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null)

    // Act & Assert
    await expect(changePassword(userId, changeData)).rejects.toThrow('User not found')
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })

  it('should throw error if old password is incorrect', async () => {
    // Arrange
    const userId = 'user-id-123'
    const changeData = {
      oldPassword: 'wrongPassword',
      newPassword: 'newPassword456',
    }

    // Create a real bcrypt hash for a different password
    const hashedPassword = await hash('correctPassword', 10)

    const user = createUser({
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(user)

    // Act & Assert
    await expect(changePassword(userId, changeData)).rejects.toThrow(
      'Current password is incorrect'
    )
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })
})
