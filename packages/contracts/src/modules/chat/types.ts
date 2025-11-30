import type { Meta, PaginationQuery } from '../../shared/types'

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  LOCATION = 'LOCATION',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export enum ChatType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export interface Message {
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

export interface Chat {
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

export interface ChatParticipant {
  id: string
  chatId: string
  userId: string
  role: 'admin' | 'member'
  joinedAt: Date
  leftAt?: Date | null
}

export interface CreateChat {
  type: ChatType
  name?: string
  participantIds: string[]
}

export interface SendMessage {
  chatId: string
  content: string
  type: MessageType
  replyToId?: string
  metadata?: Record<string, unknown>
}

export interface UpdateMessage {
  messageId: string
  content: string
}

export interface DeleteMessage {
  messageId: string
}

export interface MarkMessageAsRead {
  messageId: string
}

export interface ChatQuery extends PaginationQuery {
  type?: ChatType
}

export interface MessagesQuery extends PaginationQuery {
  chatId: string
  before?: Date
  after?: Date
}

export interface AddParticipants {
  chatId: string
  participantIds: string[]
}

export interface RemoveParticipant {
  chatId: string
  participantId: string
}

export interface UpdateChat {
  chatId: string
  name?: string
  avatarUrl?: string
}

export interface TypingIndicator {
  chatId: string
  isTyping: boolean
}

export interface ChatMessageResponse {
  message: Message
}

export interface ChatMessagesListResponse {
  messages: Message[]
  meta: Meta
}

export interface ChatResponse {
  chat: Chat
}

export interface ChatsListResponse {
  chats: Chat[]
  meta: Meta
}

export interface ChatParticipantsResponse {
  participants: ChatParticipant[]
}
