import type { EmailNotificationService } from '@/modules/identity/domain/services'
import type { UserProps, PermissionType } from '@/modules/identity/domain/entities'
import type {
  UserRepository,
  EmailVerificationRepository,
} from '@/modules/identity/domain/repositories'

import { hash } from 'bcrypt'
import { conflict } from '@repo/service-core'
import {
  UserRole,
  createUser,
  createEmailVerification,
  createVerificationExpiry,
  generateVerificationCode,
} from '@/modules/identity/domain/entities'

export type RegisterData = {
  name: string
  email: string
  password: string
  role?: UserRole
  permissions?: PermissionType[]
}

export const makeRegister =
  (
    userRepository: UserRepository,
    emailVerificationRepository: EmailVerificationRepository,
    emailNotificationService: EmailNotificationService
  ) =>
  async (data: RegisterData) => {
    const existingUser = await userRepository.findByEmail(data.email)

    if (existingUser) {
      throw conflict('User with this email already exists')
    }

    const hashedPassword = await hash(data.password, 10)

    const userProps: UserProps = {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role || UserRole.USER,
      permissions: data.permissions || [],
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const user = createUser(userProps)

    await userRepository.save(user)

    const verificationCode = generateVerificationCode()
    const expiresAt = createVerificationExpiry()

    const emailVerification = createEmailVerification({
      userId: user.id,
      code: verificationCode,
      expires: expiresAt,
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await emailVerificationRepository.save(emailVerification)

    await emailNotificationService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      code: verificationCode,
    })
  }
