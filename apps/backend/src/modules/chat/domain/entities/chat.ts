export enum ChatType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export interface ChatProps {
  id: string
  type: ChatType
  name?: string | null
  avatarUrl?: string | null
  participantIds: string[]
  createdBy: string
  lastMessageAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export const createChat = (props: Omit<ChatProps, 'id'>): ChatProps => {
  const id = crypto.randomUUID()

  return {
    id,
    ...props,
  }
}
