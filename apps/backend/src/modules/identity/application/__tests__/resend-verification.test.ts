import type { EmailNotificationService } from '@/modules/identity/domain/services'
import type { UserRepository, EmailVerificationRepository } from '@identity/domain/repositories'

import { it, vi, expect, describe, beforeEach } from 'vitest'
import { createUser, createEmailVerification } from '@identity/domain/entities'

import { makeResendVerification } from './resend-verification'

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

describe('ResendVerification Use Case', () => {
  let resendVerification: ReturnType<typeof makeResendVerification>

  beforeEach(() => {
    vi.resetAllMocks()
    resendVerification = makeResendVerification(
      mockUserRepository,
      mockEmailVerificationRepository,
      mockEmailNotificationService
    )
  })

  it('should resend verification code successfully', async () => {
    // Arrange
    const resendData = {
      email: 'john@example.com',
    }

    const user = createUser({
      email: resendData.email,
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: false,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockEmailVerificationRepository, 'findActiveByUserId').mockResolvedValue([])
    vi.spyOn(mockEmailVerificationRepository, 'save').mockResolvedValue()
    vi.spyOn(mockEmailNotificationService, 'sendVerificationEmail').mockResolvedValue()

    // Act
    await resendVerification(resendData)

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(resendData.email)
    expect(mockEmailVerificationRepository.findActiveByUserId).toHaveBeenCalledWith(user.id)
    expect(mockEmailVerificationRepository.save).toHaveBeenCalledOnce()
    expect(mockEmailNotificationService.sendVerificationEmail).toHaveBeenCalledOnce()

    // Verify that the email service was called with the user data and a code
    const emailCall = vi.mocked(mockEmailNotificationService.sendVerificationEmail).mock.calls[0][0]
    expect(emailCall.email).toBe(user.email)
    expect(emailCall.name).toBe(user.name)
    expect(emailCall.code).toBeDefined()
    expect(emailCall.code).toHaveLength(6) // Verification codes are 6 digits
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const resendData = {
      email: 'nonexistent@example.com',
    }

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null)

    // Act & Assert
    await expect(resendVerification(resendData)).rejects.toThrow('User not found')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(resendData.email)
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
    expect(mockEmailNotificationService.sendVerificationEmail).not.toHaveBeenCalled()
  })

  it('should throw error if email already verified', async () => {
    // Arrange
    const resendData = {
      email: 'john@example.com',
    }

    const user = createUser({
      email: resendData.email,
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: true, // Already verified
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)

    // Act & Assert
    await expect(resendVerification(resendData)).rejects.toThrow('Email already verified')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(resendData.email)
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
    expect(mockEmailNotificationService.sendVerificationEmail).not.toHaveBeenCalled()
  })

  it('should throw error if too many verification codes requested', async () => {
    // Arrange
    const resendData = {
      email: 'john@example.com',
    }

    const user = createUser({
      email: resendData.email,
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: false,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Three active verification codes
    const activeVerifications = [
      createEmailVerification({
        userId: user.id,
        code: '123456',
        expires: new Date(Date.now() + 3600000),
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      createEmailVerification({
        userId: user.id,
        code: '654321',
        expires: new Date(Date.now() + 3600000),
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      createEmailVerification({
        userId: user.id,
        code: '111111',
        expires: new Date(Date.now() + 3600000),
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockEmailVerificationRepository, 'findActiveByUserId').mockResolvedValue(
      activeVerifications
    )

    // Act & Assert
    await expect(resendVerification(resendData)).rejects.toThrow(
      'Too many verification codes requested'
    )
    expect(mockEmailVerificationRepository.findActiveByUserId).toHaveBeenCalledWith(user.id)
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
    expect(mockEmailNotificationService.sendVerificationEmail).not.toHaveBeenCalled()
  })

  it('should allow resending if less than 3 active codes exist', async () => {
    // Arrange
    const resendData = {
      email: 'john@example.com',
    }

    const user = createUser({
      email: resendData.email,
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: false,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Two active verification codes (less than limit)
    const activeVerifications = [
      createEmailVerification({
        userId: user.id,
        code: '123456',
        expires: new Date(Date.now() + 3600000),
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      createEmailVerification({
        userId: user.id,
        code: '654321',
        expires: new Date(Date.now() + 3600000),
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockEmailVerificationRepository, 'findActiveByUserId').mockResolvedValue(
      activeVerifications
    )
    vi.spyOn(mockEmailVerificationRepository, 'save').mockResolvedValue()
    vi.spyOn(mockEmailNotificationService, 'sendVerificationEmail').mockResolvedValue()

    // Act
    await resendVerification(resendData)

    // Assert
    expect(mockEmailVerificationRepository.findActiveByUserId).toHaveBeenCalledWith(user.id)
    expect(mockEmailVerificationRepository.save).toHaveBeenCalledOnce()
    expect(mockEmailNotificationService.sendVerificationEmail).toHaveBeenCalledOnce()
  })
})
