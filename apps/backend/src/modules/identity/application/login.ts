import type { JwtService } from '@repo/service-core'
import type { UserRepository } from '@identity/domain/repositories'

import { compare } from 'bcrypt'
import { unauthorized } from '@repo/service-core'

type LoginData = {
  email: string
  password: string
}

export const makeLogin =
  (userRepository: UserRepository, jwtService: JwtService) =>
  async ({ email, password }: LoginData): Promise<string> => {
    const user = await userRepository.findByEmail(email)

    if (!user || !(await compare(password, user.password))) {
      throw unauthorized('Invalid email or password')
    }

    // Atualizar lastLoginAt
    const updatedUser = await userRepository.updateLastLogin(user.id)
    if (!updatedUser) {
      throw unauthorized('Failed to update last login')
    }

    // Gerar token JWT
    const token = await jwtService.sign({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
    })

    return token
  }
