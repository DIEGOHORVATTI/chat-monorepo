import type { Entity } from '@/core/domain/entity'

export interface ChatSettingsProps extends Entity {
  chatId: string
  description?: string | null
  rules?: string | null
  allowMemberInvites: boolean
  allowMemberMessages: boolean
  muteNotifications: boolean
}

export const createChatSettings = (
  props: Omit<ChatSettingsProps, 'createdAt' | 'updatedAt'>
): ChatSettingsProps => ({
  ...props,
  createdAt: new Date(),
  updatedAt: new Date(),
})
