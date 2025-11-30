import { z } from 'zod'
import { meta, paginationSchema } from './base'

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

const messageSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  senderId: z.uuid(),
  content: z.string(),
  type: z.enum(MessageType),
  status: z.enum(MessageStatus),
  replyToId: z.uuid().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
})

const chatSchema = z.object({
  id: z.uuid(),
  type: z.enum(ChatType),
  name: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  participantIds: z.array(z.uuid()),
  createdBy: z.uuid(),
  lastMessageAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const chatParticipantSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  userId: z.uuid(),
  role: z.enum(['admin', 'member']),
  joinedAt: z.date(),
  leftAt: z.date().nullable().optional(),
})

// Input Schemas
export const createChatSchema = z.object({
  type: z.enum(ChatType),
  name: z.string().min(1).max(100).optional(),
  participantIds: z.array(z.uuid()).min(1),
})

export const sendMessageSchema = z.object({
  chatId: z.uuid(),
  content: z.string().min(1),
  type: z.enum(MessageType).default(MessageType.TEXT),
  replyToId: z.uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const updateMessageSchema = z.object({
  messageId: z.uuid(),
  content: z.string().min(1),
})

export const deleteMessageSchema = z.object({
  messageId: z.uuid(),
})

export const markMessageAsReadSchema = z.object({
  messageId: z.uuid(),
})

export const chatQuerySchema = paginationSchema.extend({
  type: z.enum(ChatType).optional(),
})

export const messagesQuerySchema = paginationSchema.extend({
  chatId: z.uuid(),
  before: z.date().optional(),
  after: z.date().optional(),
})

export const addParticipantsSchema = z.object({
  chatId: z.uuid(),
  participantIds: z.array(z.uuid()).min(1),
})

export const removeParticipantSchema = z.object({
  chatId: z.uuid(),
  participantId: z.uuid(),
})

export const updateChatSchema = z.object({
  chatId: z.uuid(),
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
})

// Response Schemas
export const chatMessageResponseSchema = z.object({
  message: messageSchema,
})

export const chatMessagesListResponseSchema = z.object({
  messages: z.array(messageSchema),
  meta,
})

export const chatResponseSchema = z.object({
  chat: chatSchema,
})

export const chatsListResponseSchema = z.object({
  chats: z.array(chatSchema),
  meta,
})

export const chatParticipantsResponseSchema = z.object({
  participants: z.array(chatParticipantSchema),
})

export const typingIndicatorSchema = z.object({
  chatId: z.uuid(),
  isTyping: z.boolean(),
})

// Type exports
export type Message = z.infer<typeof messageSchema>
export type Chat = z.infer<typeof chatSchema>
export type ChatParticipant = z.infer<typeof chatParticipantSchema>
export type CreateChat = z.infer<typeof createChatSchema>
export type SendMessage = z.infer<typeof sendMessageSchema>
export type UpdateMessage = z.infer<typeof updateMessageSchema>
export type DeleteMessage = z.infer<typeof deleteMessageSchema>
export type MarkMessageAsRead = z.infer<typeof markMessageAsReadSchema>
export type ChatQuery = z.infer<typeof chatQuerySchema>
export type MessagesQuery = z.infer<typeof messagesQuerySchema>
export type AddParticipants = z.infer<typeof addParticipantsSchema>
export type RemoveParticipant = z.infer<typeof removeParticipantSchema>
export type UpdateChat = z.infer<typeof updateChatSchema>
export type ChatMessageResponse = z.infer<typeof chatMessageResponseSchema>
export type ChatMessagesListResponse = z.infer<typeof chatMessagesListResponseSchema>
export type ChatResponse = z.infer<typeof chatResponseSchema>
export type ChatsListResponse = z.infer<typeof chatsListResponseSchema>
export type ChatParticipantsResponse = z.infer<typeof chatParticipantsResponseSchema>
export type TypingIndicator = z.infer<typeof typingIndicatorSchema>
