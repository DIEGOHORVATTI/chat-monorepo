import type { EmailNotificationService } from '@/modules/identity/domain/services'
import type {
  UserRepository,
  EmailVerificationRepository,
} from '@/modules/identity/domain/repositories'

import { conflict } from '@repo/service-core'
import { it, vi, expect, describe, beforeEach } from 'vitest'
import { createUser } from '@/modules/identity/domain/entities'

import { makeRegister, type RegisterData } from './index'

// Mocks
const mockUserRepository: UserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  updateLastLogin: vi.fn(),
  markEmailAsVerified: vi.fn(),
}

const mockEmailVerificationRepository: EmailVerificationRepository = {
  findByUserIdAndCode: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  markAsUsed: vi.fn(),
}

const mockEmailNotificationService: EmailNotificationService = {
  sendVerificationEmail: vi.fn(),
}

describe('Register Use Case', () => {
  let register: ReturnType<typeof makeRegister>

  beforeEach(() => {
    vi.resetAllMocks()
    register = makeRegister(
      mockUserRepository,
      mockEmailVerificationRepository,
      mockEmailNotificationService
    )
  })

  it('should register a new user successfully', async () => {
    // Arrange
    const registerData: RegisterData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    }

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null)
    vi.spyOn(mockUserRepository, 'save').mockResolvedValue()
    vi.spyOn(mockEmailVerificationRepository, 'save').mockResolvedValue()
    vi.spyOn(mockEmailNotificationService, 'sendVerificationEmail').mockResolvedValue()

    // Act
    expect(await register(registerData)).toEqual({
      user: {
        email: registerData.email,
        name: registerData.name,
        isEmailVerified: false,
      },
    })

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email)
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
    expect(mockEmailVerificationRepository.save).toHaveBeenCalledOnce()
    expect(mockEmailNotificationService.sendVerificationEmail).toHaveBeenCalledOnce()
  })

  it('should throw a conflict error if user already exists', async () => {
    // Arrange
    const registerData: RegisterData = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
    }

    const existingUser = createUser({
      ...registerData,
      isEmailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [],
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(existingUser)

    // Act & Assert
    await expect(register(registerData)).rejects.toThrow(
      conflict('User with this email already exists')
    )

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email)
    expect(mockUserRepository.save).not.toHaveBeenCalled()
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
    expect(mockEmailNotificationService.sendVerificationEmail).not.toHaveBeenCalled()
  })
})
