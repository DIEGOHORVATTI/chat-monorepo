import type { Entity } from '@/core/domain/entity'

export interface GroupPermissionsProps extends Entity {
  chatId: string
  canSendMessages: boolean
  canAddMembers: boolean
  canRemoveMembers: boolean
  canEditGroupInfo: boolean
  canPinMessages: boolean
  canDeleteMessages: boolean
}

export const createGroupPermissions = (
  props: Omit<GroupPermissionsProps, 'createdAt' | 'updatedAt'>
): GroupPermissionsProps => ({
  ...props,
  createdAt: new Date(),
  updatedAt: new Date(),
})
