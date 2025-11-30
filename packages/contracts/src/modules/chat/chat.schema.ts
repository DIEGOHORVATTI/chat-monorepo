import { z } from 'zod'
import { meta, paginationSchema } from '../../shared/base.schema'
import { MessageType, MessageStatus, ChatType } from './types'
import type {
  Message,
  Chat,
  ChatParticipant,
  CreateChat,
  SendMessage,
  UpdateMessage,
  DeleteMessage,
  MarkMessageAsRead,
  ChatQuery,
  MessagesQuery,
  AddParticipants,
  RemoveParticipant,
  UpdateChat,
  TypingIndicator,
  ChatMessageResponse,
  ChatMessagesListResponse,
  ChatResponse,
  ChatsListResponse,
  ChatParticipantsResponse,
} from './types'


const messageSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  senderId: z.uuid(),
  content: z.string(),
  type: z.nativeEnum(MessageType),
  status: z.nativeEnum(MessageStatus),
  replyToId: z.uuid().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
}) satisfies z.ZodType<Message>

const chatSchema = z.object({
  id: z.uuid(),
  type: z.nativeEnum(ChatType),
  name: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  participantIds: z.array(z.uuid()),
  createdBy: z.uuid(),
  lastMessageAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Chat>

const chatParticipantSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid(),
  userId: z.uuid(),
  role: z.enum(['admin', 'member']),
  joinedAt: z.date(),
  leftAt: z.date().nullable().optional(),
}) satisfies z.ZodType<ChatParticipant>

export const createChatSchema = z.object({
  type: z.nativeEnum(ChatType),
  name: z.string().min(1).max(100).optional(),
  participantIds: z.array(z.uuid()).min(1),
}) satisfies z.ZodType<CreateChat>

export const sendMessageSchema = z.object({
  chatId: z.uuid(),
  content: z.string().min(1),
  type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  replyToId: z.uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}) satisfies z.ZodType<SendMessage>

export const updateMessageSchema = z.object({
  messageId: z.uuid(),
  content: z.string().min(1),
}) satisfies z.ZodType<UpdateMessage>

export const deleteMessageSchema = z.object({
  messageId: z.uuid(),
}) satisfies z.ZodType<DeleteMessage>

export const markMessageAsReadSchema = z.object({
  messageId: z.uuid(),
}) satisfies z.ZodType<MarkMessageAsRead>

export const chatQuerySchema = paginationSchema.extend({
  type: z.nativeEnum(ChatType).optional(),
}) satisfies z.ZodType<ChatQuery>

export const messagesQuerySchema = paginationSchema.extend({
  chatId: z.uuid(),
  before: z.date().optional(),
  after: z.date().optional(),
}) satisfies z.ZodType<MessagesQuery>

export const addParticipantsSchema = z.object({
  chatId: z.uuid(),
  participantIds: z.array(z.uuid()).min(1),
}) satisfies z.ZodType<AddParticipants>

export const removeParticipantSchema = z.object({
  chatId: z.uuid(),
  participantId: z.uuid(),
}) satisfies z.ZodType<RemoveParticipant>

export const updateChatSchema = z.object({
  chatId: z.uuid(),
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
}) satisfies z.ZodType<UpdateChat>

export const typingIndicatorSchema = z.object({
  chatId: z.uuid(),
  isTyping: z.boolean(),
}) satisfies z.ZodType<TypingIndicator>

export const chatMessageResponseSchema = z.object({
  message: messageSchema,
}) satisfies z.ZodType<ChatMessageResponse>

export const chatMessagesListResponseSchema = z.object({
  messages: z.array(messageSchema),
  meta,
}) satisfies z.ZodType<ChatMessagesListResponse>

export const chatResponseSchema = z.object({
  chat: chatSchema,
}) satisfies z.ZodType<ChatResponse>

export const chatsListResponseSchema = z.object({
  chats: z.array(chatSchema),
  meta,
}) satisfies z.ZodType<ChatsListResponse>

export const chatParticipantsResponseSchema = z.object({
  participants: z.array(chatParticipantSchema),
}) satisfies z.ZodType<ChatParticipantsResponse>
