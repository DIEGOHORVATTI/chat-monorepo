import type { ChatSettingsProps } from '@/modules/chat/domain/entities'

export class ChatSettingsMapper {
  static toDomain(raw: Record<string, unknown>): ChatSettingsProps {
    return {
      id: raw.id as string,
      chatId: raw.chatId as string,
      description: (raw.description as string) || null,
      rules: (raw.rules as string) || null,
      allowMemberInvites: raw.allowMemberInvites as boolean,
      allowMemberMessages: raw.allowMemberMessages as boolean,
      muteNotifications: raw.muteNotifications as boolean,
      createdAt: new Date(raw.createdAt as string),
      updatedAt: new Date(raw.updatedAt as string),
    }
  }

  static toPersistence(settings: ChatSettingsProps): Record<string, unknown> {
    return {
      id: settings.id,
      chatId: settings.chatId,
      description: settings.description,
      rules: settings.rules,
      allowMemberInvites: settings.allowMemberInvites,
      allowMemberMessages: settings.allowMemberMessages,
      muteNotifications: settings.muteNotifications,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    }
  }
}
