import type { UserRepository } from '@identity/domain/repositories'

import { paginate } from '@/utils/paginate'

export const makeGetOnlineUsers = (userRepository: UserRepository) => async () => {
  const onlineUsers = await userRepository.getOnlineUsers()

  const users = onlineUsers.map((user) => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    status: user.status,
    customStatus: user.customStatus,
    lastSeen: user.lastLoginAt || user.updatedAt,
  }))

  return paginate(users, users.length, { page: 1, limit: users.length })
}
