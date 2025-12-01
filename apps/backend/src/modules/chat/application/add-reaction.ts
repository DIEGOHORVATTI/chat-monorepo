import type {
  MessageRepository,
  ReactionRepository,
  ChatParticipantRepository,
} from '@/modules/chat/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { createReaction } from '@/modules/chat/domain/entities'

export const makeAddReaction =
  (
    reactionRepository: ReactionRepository,
    messageRepository: MessageRepository,
    participantRepository: ChatParticipantRepository
  ) =>
  async (currentUserId: string, messageId: string, emoji: string) => {
    const message = await messageRepository.findById(messageId)

    if (!message) {
      throw notFound('Message not found')
    }

    // Verificar se o usuário é participante do chat
    const participant = await participantRepository.findByChatAndUser(message.chatId, currentUserId)

    if (!participant) {
      throw badRequest('You are not a participant of this chat')
    }

    // Verificar se já existe uma reação deste usuário com este emoji
    const existingReaction = await reactionRepository.findByMessageAndUser(messageId, currentUserId)

    if (existingReaction && existingReaction.emoji === emoji) {
      throw badRequest('You already reacted with this emoji')
    }

    const reaction = createReaction({
      id: crypto.randomUUID(),
      messageId,
      userId: currentUserId,
      emoji,
    })

    return reactionRepository.save(reaction)
  }
