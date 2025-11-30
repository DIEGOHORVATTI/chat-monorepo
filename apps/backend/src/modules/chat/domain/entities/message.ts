export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  VOICE = 'VOICE',
  LOCATION = 'LOCATION',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface MessageProps {
  id: string
  chatId: string
  senderId: string
  content: string
  type: MessageType
  status: MessageStatus
  replyToId?: string | null
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export const createMessage = (props: Omit<MessageProps, 'id'>): MessageProps => {
  const id = crypto.randomUUID()

  return {
    id,
    ...props,
  }
}
