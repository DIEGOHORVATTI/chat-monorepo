import type { GroupPermissionsRepository } from '@/modules/chat/domain/repositories'

import { notFound } from '@repo/service-core'

export const makeGetGroupPermissions =
  (groupPermissionsRepository: GroupPermissionsRepository) => async (chatId: string) => {
    const permissions = await groupPermissionsRepository.findByChatId(chatId)

    if (!permissions) {
      throw notFound('Group permissions not found')
    }

    return permissions
  }
