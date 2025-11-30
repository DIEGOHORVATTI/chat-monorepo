export enum ParticipantRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface ChatParticipantProps {
  id: string
  chatId: string
  userId: string
  role: ParticipantRole
  joinedAt: Date
  leftAt?: Date | null
}

export const createChatParticipant = (
  props: Omit<ChatParticipantProps, 'id'>
): ChatParticipantProps => {
  const id = crypto.randomUUID()

  return {
    id,
    ...props,
  }
}
