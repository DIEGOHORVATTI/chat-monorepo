import type { UserRepository } from '@identity/domain/repositories'

export const makeListUsers =
  (userRepository: UserRepository) => async (page: number, limit: number) => {
    const result = await userRepository.findAll(page, limit)

    return result
  }
