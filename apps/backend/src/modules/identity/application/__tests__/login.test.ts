import type { JwtService } from '@repo/service-core'
import type { UserRepository } from '@identity/domain/repositories'

import { hash } from 'bcrypt'
import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeLogin } from '../login'

const mockUserRepository: UserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  updateLastLogin: vi.fn(),
  markEmailAsVerified: vi.fn(),
}

const mockJwtService: JwtService = {
  sign: vi.fn(),
  verify: vi.fn(),
}

describe('Login Use Case', () => {
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

    // Create a real bcrypt hash for 'password123'
    const hashedPassword = await hash('password123', 10)

    const user = createUser({
      email: loginData.email,
      name: 'John Doe',
      password: hashedPassword,
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const updatedUser = {
      ...user,
      lastLoginAt: new Date(),
    }

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockUserRepository, 'updateLastLogin').mockResolvedValue(updatedUser)
    vi.spyOn(mockJwtService, 'sign').mockResolvedValue('mock-jwt-token')

    // Act
    const token = await login(loginData)

    // Assert
    expect(token).toBe('mock-jwt-token')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
    expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(user.id)
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      permissions: updatedUser.permissions,
    })
  })

  it('should throw unauthorized error when user not found', async () => {
    // Arrange
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    }

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null)

    // Act & Assert
    await expect(login(loginData)).rejects.toThrow('Invalid email or password')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
    expect(mockUserRepository.updateLastLogin).not.toHaveBeenCalled()
    expect(mockJwtService.sign).not.toHaveBeenCalled()
  })

  it('should throw unauthorized error when password is invalid', async () => {
    // Arrange
    const loginData = {
      email: 'john@example.com',
      password: 'wrongpassword',
    }

    const user = createUser({
      email: loginData.email,
      name: 'John Doe',
      password: '$2b$10$K8BQq9XfJXXJz6W5i1K5t.H1yL3h9hG5L6W7L8H9K0L1M2N3O4P5Q',
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)

    // Act & Assert
    await expect(login(loginData)).rejects.toThrow('Invalid email or password')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
    expect(mockUserRepository.updateLastLogin).not.toHaveBeenCalled()
    expect(mockJwtService.sign).not.toHaveBeenCalled()
  })

  it('should throw unauthorized error when update last login fails', async () => {
    // Arrange
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    }

    // Create a real bcrypt hash for 'password123'
    const hashedPassword = await hash('password123', 10)

    const user = createUser({
      email: loginData.email,
      name: 'John Doe',
      password: hashedPassword,
      isEmailVerified: true,
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockUserRepository, 'updateLastLogin').mockResolvedValue(null)

    // Act & Assert
    await expect(login(loginData)).rejects.toThrow('Failed to update last login')
    expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(user.id)
    expect(mockJwtService.sign).not.toHaveBeenCalled()
  })
})
