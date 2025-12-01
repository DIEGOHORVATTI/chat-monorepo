import type {
  ChatRepository,
  ChatParticipantRepository,
  GroupPermissionsRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole, createGroupPermissions } from '@/modules/chat/domain/entities'

export type UpdateGroupPermissionsData = {
  canSendMessages?: boolean
  canAddMembers?: boolean
  canRemoveMembers?: boolean
  canEditGroupInfo?: boolean
  canPinMessages?: boolean
  canDeleteMessages?: boolean
}

export const makeUpdateGroupPermissions =
  (
    groupPermissionsRepository: GroupPermissionsRepository,
    chatRepository: ChatRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, chatId: string, data: UpdateGroupPermissionsData) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é admin
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can update group permissions')
    }

    let permissions = await groupPermissionsRepository.findByChatId(chatId)

    if (!permissions) {
      // Criar permissões padrão
      permissions = createGroupPermissions({
        id: crypto.randomUUID(),
        chatId,
        canSendMessages: data.canSendMessages ?? true,
        canAddMembers: data.canAddMembers ?? true,
        canRemoveMembers: data.canRemoveMembers ?? false,
        canEditGroupInfo: data.canEditGroupInfo ?? false,
        canPinMessages: data.canPinMessages ?? false,
        canDeleteMessages: data.canDeleteMessages ?? false,
      })

      return groupPermissionsRepository.save(permissions)
    }

    const updatedPermissions = {
      ...permissions,
      canSendMessages: data.canSendMessages ?? permissions.canSendMessages,
      canAddMembers: data.canAddMembers ?? permissions.canAddMembers,
      canRemoveMembers: data.canRemoveMembers ?? permissions.canRemoveMembers,
      canEditGroupInfo: data.canEditGroupInfo ?? permissions.canEditGroupInfo,
      canPinMessages: data.canPinMessages ?? permissions.canPinMessages,
      canDeleteMessages: data.canDeleteMessages ?? permissions.canDeleteMessages,
      updatedAt: new Date(),
    }

    return groupPermissionsRepository.update(updatedPermissions)
  }
