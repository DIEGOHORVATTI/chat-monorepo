import type { Meta, PaginationQuery } from '../../shared/types'

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

export interface SearchMessagesQuery extends PaginationQuery {
  query: string
  chatId?: string
  fromDate?: Date
  toDate?: Date
}

export interface SearchChatsQuery extends PaginationQuery {
  query: string
  type?: ChatType
}

export interface SearchUsersQuery extends PaginationQuery {
  query: string
  excludeBlocked?: boolean
}

export interface Reaction {
  id: string
  messageId: string
  userId: string
  emoji: string
  createdAt: Date
}

export interface AddReaction {
  messageId: string
  emoji: string
}

export interface RemoveReaction {
  messageId: string
  reactionId: string
}

export interface PinMessage {
  messageId: string
  chatId: string
}

export interface UnpinMessage {
  messageId: string
  chatId: string
}

export interface UpdateParticipantRole {
  chatId: string
  participantId: string
  role: 'admin' | 'member'
}

export interface ChatSettings {
  description?: string
  rules?: string
  allowMemberInvites: boolean
  allowMemberMessages: boolean
  muteNotifications: boolean
}

export interface UpdateChatSettings {
  chatId: string
  settings: Partial<ChatSettings>
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

export interface ReactionsResponse {
  reactions: Reaction[]
}

export interface ChatSettingsResponse {
  settings: ChatSettings
}

export interface UserSearchResult {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  isOnline: boolean
}

export interface UsersSearchResponse {
  users: UserSearchResult[]
  meta: Meta
}

export interface SendVoiceMessage {
  chatId: string
  audioUrl: string
  duration: number
  waveform?: number[]
}

export interface ForwardMessage {
  messageId: string
  toChatIds: string[]
}

export interface ForwardMessageResponse {
  forwardedMessages: Message[]
  meta: Meta
}

export interface GroupPermissions {
  canSendMessages: boolean
  canAddMembers: boolean
  canRemoveMembers: boolean
  canEditGroupInfo: boolean
  canPinMessages: boolean
  canDeleteMessages: boolean
}

export interface UpdateGroupPermissions {
  chatId: string
  permissions: Partial<GroupPermissions>
}

export interface GroupPermissionsResponse {
  permissions: GroupPermissions
  meta: Meta
}

export interface GenerateLinkPreview {
  url: string
}

export interface LinkPreview {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
}

export interface LinkPreviewResponse {
  preview: LinkPreview
  meta: Meta
}
