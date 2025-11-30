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
  SearchMessagesQuery,
  SearchChatsQuery,
  SearchUsersQuery,
  Reaction,
  AddReaction,
  RemoveReaction,
  PinMessage,
  UnpinMessage,
  UpdateParticipantRole,
  ChatSettings,
  UpdateChatSettings,
  SendVoiceMessage,
  ForwardMessage,
  GroupPermissions,
  UpdateGroupPermissions,
  GenerateLinkPreview,
  LinkPreview,
  LeaveChat,
  UnreadCount,
  ChatMessageResponse,
  ChatMessagesListResponse,
  ChatResponse,
  ChatsListResponse,
  ChatParticipantsResponse,
  ReactionsResponse,
  ChatSettingsResponse,
  UsersSearchResponse,
  ForwardMessageResponse,
  GroupPermissionsResponse,
  LinkPreviewResponse,
  UnreadCountResponse,
} from './types'

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
}) satisfies z.ZodType<Message>

const chatSchema = z.object({
  id: z.uuid(),
  type: z.enum(ChatType),
  name: z.string().nullable().optional(),
  avatarUrl: z.url().nullable().optional(),
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
  type: z.enum(ChatType),
  name: z.string().min(1).max(100).optional(),
  participantIds: z.array(z.uuid()).min(1),
}) satisfies z.ZodType<CreateChat>

export const sendMessageSchema = z.object({
  chatId: z.uuid(),
  content: z.string().min(1),
  type: z.enum(MessageType).default(MessageType.TEXT),
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
  type: z.enum(ChatType).optional(),
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
  avatarUrl: z.url().optional(),
}) satisfies z.ZodType<UpdateChat>

export const typingIndicatorSchema = z.object({
  chatId: z.uuid(),
  isTyping: z.boolean(),
}) satisfies z.ZodType<TypingIndicator>

export const searchMessagesQuerySchema = paginationSchema.extend({
  query: z.string().min(1),
  chatId: z.uuid().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
}) satisfies z.ZodType<SearchMessagesQuery>

export const searchChatsQuerySchema = paginationSchema.extend({
  query: z.string().min(1),
  type: z.enum(ChatType).optional(),
}) satisfies z.ZodType<SearchChatsQuery>

export const searchUsersQuerySchema = paginationSchema.extend({
  query: z.string().min(1),
  excludeBlocked: z.boolean().optional(),
}) satisfies z.ZodType<SearchUsersQuery>

const reactionSchema = z.object({
  id: z.uuid(),
  messageId: z.uuid(),
  userId: z.uuid(),
  emoji: z.string(),
  createdAt: z.date(),
}) satisfies z.ZodType<Reaction>

export const addReactionSchema = z.object({
  messageId: z.uuid(),
  emoji: z.string().min(1).max(10),
}) satisfies z.ZodType<AddReaction>

export const removeReactionSchema = z.object({
  messageId: z.uuid(),
  reactionId: z.uuid(),
}) satisfies z.ZodType<RemoveReaction>

export const pinMessageSchema = z.object({
  messageId: z.uuid(),
  chatId: z.uuid(),
}) satisfies z.ZodType<PinMessage>

export const unpinMessageSchema = z.object({
  messageId: z.uuid(),
  chatId: z.uuid(),
}) satisfies z.ZodType<UnpinMessage>

export const updateParticipantRoleSchema = z.object({
  chatId: z.uuid(),
  participantId: z.uuid(),
  role: z.enum(['admin', 'member']),
}) satisfies z.ZodType<UpdateParticipantRole>

const chatSettingsSchema = z.object({
  description: z.string().optional(),
  rules: z.string().optional(),
  allowMemberInvites: z.boolean(),
  allowMemberMessages: z.boolean(),
  muteNotifications: z.boolean(),
}) satisfies z.ZodType<ChatSettings>

export const updateChatSettingsSchema = z.object({
  chatId: z.uuid(),
  settings: chatSettingsSchema.partial(),
}) satisfies z.ZodType<UpdateChatSettings>

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

export const reactionsResponseSchema = z.object({
  reactions: z.array(reactionSchema),
}) satisfies z.ZodType<ReactionsResponse>

export const chatSettingsResponseSchema = z.object({
  settings: chatSettingsSchema,
}) satisfies z.ZodType<ChatSettingsResponse>

const userSearchResultSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.url().nullable().optional(),
  isOnline: z.boolean(),
})

export const usersSearchResponseSchema = z.object({
  users: z.array(userSearchResultSchema),
  meta,
}) satisfies z.ZodType<UsersSearchResponse>

export const sendVoiceMessageSchema = z.object({
  chatId: z.uuid(),
  audioUrl: z.url(),
  duration: z.number().positive(),
  waveform: z.array(z.number()).optional(),
}) satisfies z.ZodType<SendVoiceMessage>

export const forwardMessageSchema = z.object({
  messageId: z.uuid(),
  toChatIds: z.array(z.uuid()).min(1),
}) satisfies z.ZodType<ForwardMessage>

export const forwardMessageResponseSchema = z.object({
  forwardedMessages: z.array(messageSchema),
  meta,
}) satisfies z.ZodType<ForwardMessageResponse>

const groupPermissionsSchema = z.object({
  canSendMessages: z.boolean(),
  canAddMembers: z.boolean(),
  canRemoveMembers: z.boolean(),
  canEditGroupInfo: z.boolean(),
  canPinMessages: z.boolean(),
  canDeleteMessages: z.boolean(),
}) satisfies z.ZodType<GroupPermissions>

export const updateGroupPermissionsSchema = z.object({
  chatId: z.uuid(),
  permissions: groupPermissionsSchema.partial(),
}) satisfies z.ZodType<UpdateGroupPermissions>

export const groupPermissionsResponseSchema = z.object({
  permissions: groupPermissionsSchema,
  meta,
}) satisfies z.ZodType<GroupPermissionsResponse>

const linkPreviewSchema = z.object({
  url: z.url(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.url().optional(),
  siteName: z.string().optional(),
}) satisfies z.ZodType<LinkPreview>

export const generateLinkPreviewSchema = z.object({
  url: z.url(),
}) satisfies z.ZodType<GenerateLinkPreview>

export const linkPreviewResponseSchema = z.object({
  preview: linkPreviewSchema,
  meta,
}) satisfies z.ZodType<LinkPreviewResponse>

export const leaveChatSchema = z.object({
  chatId: z.uuid(),
}) satisfies z.ZodType<LeaveChat>

const unreadCountSchema = z.object({
  total: z.number(),
  chats: z.array(
    z.object({
      chatId: z.uuid(),
      unreadCount: z.number(),
    })
  ),
}) satisfies z.ZodType<UnreadCount>

export const unreadCountResponseSchema = z.object({
  unreadCount: unreadCountSchema,
  meta,
}) satisfies z.ZodType<UnreadCountResponse>
