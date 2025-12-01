import type {
  ChatRepository,
  ChatSettingsRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'
import { ParticipantRole, createChatSettings } from '@/modules/chat/domain/entities'

export type UpdateChatSettingsData = {
  description?: string
  rules?: string
  allowMemberInvites?: boolean
  allowMemberMessages?: boolean
  muteNotifications?: boolean
}

export const makeUpdateChatSettings =
  (
    chatSettingsRepository: ChatSettingsRepository,
    chatRepository: ChatRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, chatId: string, data: UpdateChatSettingsData) => {
    const chat = await chatRepository.findById(chatId)

    if (!chat) {
      throw notFound('Chat not found')
    }

    // Verificar se o usuário é admin
    const participant = await participantRepository.findByChatAndUser(chatId, currentUserId)

    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw forbidden('Only admins can update chat settings')
    }

    let settings = await chatSettingsRepository.findByChatId(chatId)

    if (!settings) {
      // Criar settings padrão
      settings = createChatSettings({
        id: crypto.randomUUID(),
        chatId,
        description: data.description ?? null,
        rules: data.rules ?? null,
        allowMemberInvites: data.allowMemberInvites ?? true,
        allowMemberMessages: data.allowMemberMessages ?? true,
        muteNotifications: data.muteNotifications ?? false,
      })

      return chatSettingsRepository.save(settings)
    }

    const updatedSettings = {
      ...settings,
      description: data.description ?? settings.description,
      rules: data.rules ?? settings.rules,
      allowMemberInvites: data.allowMemberInvites ?? settings.allowMemberInvites,
      allowMemberMessages: data.allowMemberMessages ?? settings.allowMemberMessages,
      muteNotifications: data.muteNotifications ?? settings.muteNotifications,
      updatedAt: new Date(),
    }

    return chatSettingsRepository.update(updatedSettings)
  }
