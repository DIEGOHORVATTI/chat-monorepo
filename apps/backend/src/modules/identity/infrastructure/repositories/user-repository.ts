import type { UserRepository } from '@identity/domain/repositories'

import { paginate } from '@/utils/paginate'
import { prisma } from '@/core/infra/db/prisma'
import { UserMapper } from '@identity/infrastructure/mappers'

export const makeUserRepository = (): UserRepository => ({
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  },

  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  },

  async findAll(page = 1, limit = 20) {
    const [prismaUsers, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.user.count(),
    ])

    return paginate(prismaUsers.map(UserMapper.toDomain), total, { page, limit })
  },

  async save(user) {
    const data = UserMapper.toPersistence(user)
    await prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    })
  },

  async updateLastLogin(id) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    })

    return UserMapper.toDomain(user)
  },

  async markEmailAsVerified(id) {
    await prisma.user.update({
      where: { id },
      data: {
        isEmailVerified: true,
        updatedAt: new Date(),
      },
    })
  },
})
