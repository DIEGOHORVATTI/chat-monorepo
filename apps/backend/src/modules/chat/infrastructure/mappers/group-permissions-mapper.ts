import type { GroupPermissionsProps } from '@/modules/chat/domain/entities'

export class GroupPermissionsMapper {
  static toDomain(raw: Record<string, unknown>): GroupPermissionsProps {
    return {
      id: raw.id as string,
      chatId: raw.chatId as string,
      canSendMessages: raw.canSendMessages as boolean,
      canAddMembers: raw.canAddMembers as boolean,
      canRemoveMembers: raw.canRemoveMembers as boolean,
      canEditGroupInfo: raw.canEditGroupInfo as boolean,
      canPinMessages: raw.canPinMessages as boolean,
      canDeleteMessages: raw.canDeleteMessages as boolean,
      createdAt: new Date(raw.createdAt as string),
      updatedAt: new Date(raw.updatedAt as string),
    }
  }

  static toPersistence(permissions: GroupPermissionsProps): Record<string, unknown> {
    return {
      id: permissions.id,
      chatId: permissions.chatId,
      canSendMessages: permissions.canSendMessages,
      canAddMembers: permissions.canAddMembers,
      canRemoveMembers: permissions.canRemoveMembers,
      canEditGroupInfo: permissions.canEditGroupInfo,
      canPinMessages: permissions.canPinMessages,
      canDeleteMessages: permissions.canDeleteMessages,
      createdAt: permissions.createdAt,
      updatedAt: permissions.updatedAt,
    }
  }
}
