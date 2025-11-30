import type { UserRepository } from '@identity/domain/repositories'

import { createUser } from '@identity/domain/entities'
import { it, vi, expect, describe, beforeEach } from 'vitest'

import { makeListUsers } from './list-users'

const mockUserRepository: UserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  updateLastLogin: vi.fn(),
  markEmailAsVerified: vi.fn(),
}

describe('ListUsers Use Case', () => {
  let listUsers: ReturnType<typeof makeListUsers>

  beforeEach(() => {
    vi.resetAllMocks()
    listUsers = makeListUsers(mockUserRepository)
  })

  it('should list users successfully with pagination', async () => {
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
    expect(result.data).toHaveLength(2)
    expect(result.meta.total).toBe(2)
    expect(result.meta.page).toBe(1)
    expect(result.meta.limit).toBe(10)
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
    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(page, limit)
  })

  it('should handle different page numbers correctly', async () => {
    // Arrange
    const page = 2
    const limit = 5

    const users = [
      createUser({
        email: 'user6@example.com',
        name: 'User 6',
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
        total: 6,
        page: 2,
        limit: 5,
        pages: 2,
      },
    }

    vi.spyOn(mockUserRepository, 'findAll').mockResolvedValue(expectedResult)

    // Act
    const result = await listUsers(page, limit)

    // Assert
    expect(result).toEqual(expectedResult)
    expect(result.meta.page).toBe(2)
    expect(result.meta.pages).toBe(2)
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(page, limit)
  })
})
