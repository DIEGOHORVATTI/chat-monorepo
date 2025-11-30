import type { JwtService } from '@repo/service-core'
import type { EmailNotificationService } from '@identity/domain/services'
import type { UserRepository, EmailVerificationRepository } from '@identity/domain/repositories'

import { it, vi, expect, describe, beforeEach } from 'vitest'
import { makeLogin } from '@/modules/identity/application/login'
import { makeGetMe } from '@/modules/identity/application/get-me'
import { makeListUsers } from '@/modules/identity/application/list-users'
import { makeVerifyEmail } from '@/modules/identity/application/verify-email'
import { createUser, createEmailVerification } from '@identity/domain/entities'
import { makeResendVerification } from '@/modules/identity/application/resend-verification'

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

const mockJwtService: JwtService = {
  sign: vi.fn(),
  verify: vi.fn(),
}

describe('Identity Routes - Login', () => {
  let login: ReturnType<typeof makeLogin>

  beforeEach(() => {
    vi.resetAllMocks()
    login = makeLogin(mockUserRepository, mockJwtService)
  })

  it('should login successfully with valid credentials', async () => {
    // Arrange
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    }

    const user = createUser({
      email: loginData.email,
      name: 'John Doe',
      password: '$2b$10$K8BQq9XfJXXJz6W5i1K5t.H1yL3h9hG5L6W7L8H9K0L1M2N3O4P5Q', // hash of 'password123'
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockUserRepository, 'updateLastLogin').mockResolvedValue({
      ...user,
      lastLoginAt: new Date(),
    })
    vi.spyOn(mockJwtService, 'sign').mockResolvedValue('mock-jwt-token')

    // Act
    const token = await login(loginData)

    // Assert
    expect(token).toBe('mock-jwt-token')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
    expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(user.id)
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      name: user.name,
      permissions: user.permissions,
    })
  })

  it('should throw unauthorized error with invalid credentials', async () => {
    // Arrange
    const loginData = {
      email: 'john@example.com',
      password: 'wrongpassword',
    }

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null)

    // Act & Assert
    await expect(login(loginData)).rejects.toThrow('Invalid email or password')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
    expect(mockUserRepository.updateLastLogin).not.toHaveBeenCalled()
    expect(mockJwtService.sign).not.toHaveBeenCalled()
  })
})

describe('Identity Routes - Verify Email', () => {
  let verifyEmail: ReturnType<typeof makeVerifyEmail>

  beforeEach(() => {
    vi.resetAllMocks()
    verifyEmail = makeVerifyEmail(mockUserRepository, mockEmailVerificationRepository)
  })

  it('should verify email successfully with valid code', async () => {
    // Arrange
    const verifyData = {
      userId: 'user-id-123',
      code: '123456',
    }

    const user = createUser({
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: false,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const emailVerification = createEmailVerification({
      userId: user.id,
      code: verifyData.code,
      expires: new Date(Date.now() + 3600000), // 1 hour from now
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(user)
    vi.spyOn(mockEmailVerificationRepository, 'findByUserIdAndCode').mockResolvedValue(
      emailVerification
    )
    vi.spyOn(mockEmailVerificationRepository, 'markAsUsed').mockResolvedValue()
    vi.spyOn(mockUserRepository, 'markEmailAsVerified').mockResolvedValue()

    // Act
    await verifyEmail(verifyData)

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(verifyData.userId)
    expect(mockEmailVerificationRepository.findByUserIdAndCode).toHaveBeenCalledWith(
      verifyData.userId,
      verifyData.code
    )
    expect(mockEmailVerificationRepository.markAsUsed).toHaveBeenCalledWith(emailVerification.id)
    expect(mockUserRepository.markEmailAsVerified).toHaveBeenCalledWith(verifyData.userId)
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const verifyData = {
      userId: 'non-existent-user',
      code: '123456',
    }

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null)

    // Act & Assert
    await expect(verifyEmail(verifyData)).rejects.toThrow('User not found')
    expect(mockUserRepository.findById).toHaveBeenCalledWith(verifyData.userId)
    expect(mockEmailVerificationRepository.findByUserIdAndCode).not.toHaveBeenCalled()
  })

  it('should throw error if email already verified', async () => {
    // Arrange
    const verifyData = {
      userId: 'user-id-123',
      code: '123456',
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

    // Act & Assert
    await expect(verifyEmail(verifyData)).rejects.toThrow('Email already verified')
    expect(mockEmailVerificationRepository.findByUserIdAndCode).not.toHaveBeenCalled()
  })

  it('should throw error if verification code is invalid', async () => {
    // Arrange
    const verifyData = {
      userId: 'user-id-123',
      code: 'invalid-code',
    }

    const user = createUser({
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed-password',
      isEmailVerified: false,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(user)
    vi.spyOn(mockEmailVerificationRepository, 'findByUserIdAndCode').mockResolvedValue(null)

    // Act & Assert
    await expect(verifyEmail(verifyData)).rejects.toThrow('Invalid or expired verification code')
    expect(mockEmailVerificationRepository.markAsUsed).not.toHaveBeenCalled()
    expect(mockUserRepository.markEmailAsVerified).not.toHaveBeenCalled()
  })
})

describe('Identity Routes - Resend Verification', () => {
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
  })

  it('should throw error if user not found', async () => {
    // Arrange
    const resendData = {
      email: 'non-existent@example.com',
    }

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null)

    // Act & Assert
    await expect(resendVerification(resendData)).rejects.toThrow('User not found')
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
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
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)

    // Act & Assert
    await expect(resendVerification(resendData)).rejects.toThrow('Email already verified')
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
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
    expect(mockEmailVerificationRepository.save).not.toHaveBeenCalled()
  })
})

describe('Identity Routes - List Users', () => {
  let listUsers: ReturnType<typeof makeListUsers>

  beforeEach(() => {
    vi.resetAllMocks()
    listUsers = makeListUsers(mockUserRepository)
  })

  it('should list users successfully', async () => {
    // Arrange
    const page = 1
    const limit = 10

    const users = [
      createUser({
        email: 'user1@example.com',
        name: 'User 1',
        password: 'hashed-password',
        isEmailVerified: true,
        isActive: true,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      createUser({
        email: 'user2@example.com',
        name: 'User 2',
        password: 'hashed-password',
        isEmailVerified: true,
        isActive: true,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]

    const expectedResult = {
      data: users,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        pages: 1,
      },
    }

    vi.spyOn(mockUserRepository, 'findAll').mockResolvedValue(expectedResult)

    // Act
    const result = await listUsers(page, limit)

    // Assert
    expect(result).toEqual(expectedResult)
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(page, limit)
  })

  it('should return empty list when no users found', async () => {
    // Arrange
    const page = 1
    const limit = 10

    const expectedResult = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    }

    vi.spyOn(mockUserRepository, 'findAll').mockResolvedValue(expectedResult)

    // Act
    const result = await listUsers(page, limit)

    // Assert
    expect(result).toEqual(expectedResult)
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(page, limit)
  })
})

describe('Identity Routes - Get Me', () => {
  let getMe: ReturnType<typeof makeGetMe>

  beforeEach(() => {
    vi.resetAllMocks()
    getMe = makeGetMe(mockUserRepository)
  })

  it('should get user profile successfully', async () => {
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
