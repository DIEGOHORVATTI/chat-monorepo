import { oc } from '@orpc/contract'
import { z } from 'zod'

import {
  meta,
  paginationSchema,
  messageResponseSchema as baseMessageResponseSchema,
} from '../shared/base.schema'

enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  VOICE = 'VOICE',
  LOCATION = 'LOCATION',
}

enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

enum ChatType {
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
  avatarUrl: z.url().nullable().optional(),
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
  avatarUrl: z.url().optional(),
})

export const typingIndicatorSchema = z.object({
  chatId: z.uuid(),
  isTyping: z.boolean(),
})

export const searchMessagesQuerySchema = paginationSchema.extend({
  query: z.string().min(1),
  chatId: z.uuid().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
})

export const searchChatsQuerySchema = paginationSchema.extend({
  query: z.string().min(1),
  type: z.enum(ChatType).optional(),
})

export const searchUsersQuerySchema = paginationSchema.extend({
  query: z.string().min(1),
  excludeBlocked: z.boolean().optional(),
})

const reactionSchema = z.object({
  id: z.uuid(),
  messageId: z.uuid(),
  userId: z.uuid(),
  emoji: z.string(),
  createdAt: z.date(),
})

export const addReactionSchema = z.object({
  messageId: z.uuid(),
  emoji: z.string().min(1).max(10),
})

export const removeReactionSchema = z.object({
  messageId: z.uuid(),
  reactionId: z.uuid(),
})

export const pinMessageSchema = z.object({
  messageId: z.uuid(),
  chatId: z.uuid(),
})

export const unpinMessageSchema = z.object({
  messageId: z.uuid(),
  chatId: z.uuid(),
})

export const updateParticipantRoleSchema = z.object({
  chatId: z.uuid(),
  participantId: z.uuid(),
  role: z.enum(['admin', 'member']),
})

const chatSettingsSchema = z.object({
  description: z.string().optional(),
  rules: z.string().optional(),
  allowMemberInvites: z.boolean(),
  allowMemberMessages: z.boolean(),
  muteNotifications: z.boolean(),
})

export const updateChatSettingsSchema = z.object({
  chatId: z.uuid(),
  settings: chatSettingsSchema.partial(),
})

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

export const reactionsResponseSchema = z.object({
  reactions: z.array(reactionSchema),
})

export const chatSettingsResponseSchema = z.object({
  settings: chatSettingsSchema,
})

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
})

export const sendVoiceMessageSchema = z.object({
  chatId: z.uuid(),
  audioUrl: z.url(),
  duration: z.number().positive(),
  waveform: z.array(z.number()).optional(),
})

export const forwardMessageSchema = z.object({
  messageId: z.uuid(),
  toChatIds: z.array(z.uuid()).min(1),
})

export const forwardMessageResponseSchema = z.object({
  forwardedMessages: z.array(messageSchema),
  meta,
})

const groupPermissionsSchema = z.object({
  canSendMessages: z.boolean(),
  canAddMembers: z.boolean(),
  canRemoveMembers: z.boolean(),
  canEditGroupInfo: z.boolean(),
  canPinMessages: z.boolean(),
  canDeleteMessages: z.boolean(),
})

export const updateGroupPermissionsSchema = z.object({
  chatId: z.uuid(),
  permissions: groupPermissionsSchema.partial(),
})

export const groupPermissionsResponseSchema = z.object({
  permissions: groupPermissionsSchema,
  meta,
})

const linkPreviewSchema = z.object({
  url: z.url(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.url().optional(),
  siteName: z.string().optional(),
})

export const generateLinkPreviewSchema = z.object({
  url: z.url(),
})

export const linkPreviewResponseSchema = z.object({
  preview: linkPreviewSchema,
  meta,
})

export const leaveChatSchema = z.object({
  chatId: z.uuid(),
})

const unreadCountSchema = z.object({
  total: z.number(),
  chats: z.array(
    z.object({
      chatId: z.uuid(),
      unreadCount: z.number(),
    })
  ),
})

export const unreadCountResponseSchema = z.object({
  unreadCount: unreadCountSchema,
  meta,
})

const prefix = oc.route({ tags: ['Chat'] })

export const chat = oc.prefix('/chat').router({
  createChat: prefix
    .route({
      method: 'POST',
      path: '/chats',
      summary: 'Criar chat',
      description: 'Cria um novo chat (direto ou em grupo)',
    })
    .input(createChatSchema)
    .output(chatResponseSchema),

  listChats: prefix
    .route({
      method: 'GET',
      path: '/chats',
      summary: 'Listar chats',
      description: 'Lista todos os chats do usuário atual',
    })
    .input(chatQuerySchema)
    .output(chatsListResponseSchema),

  getChat: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId',
      summary: 'Obter chat',
      description: 'Obtém um chat específico pelo ID',
    })
    .output(chatResponseSchema),

  updateChat: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId',
      summary: 'Atualizar chat',
      description: 'Atualiza detalhes do chat (nome, avatar)',
    })
    .input(updateChatSchema)
    .output(chatResponseSchema),

  deleteChat: prefix
    .route({
      method: 'DELETE',
      path: '/chats/:chatId',
      summary: 'Excluir chat',
      description: 'Exclui um chat',
    })
    .output(baseMessageResponseSchema),

  addParticipants: prefix
    .route({
      method: 'POST',
      path: '/chats/:chatId/participants',
      summary: 'Adicionar participantes',
      description: 'Adiciona participantes a um chat em grupo',
    })
    .input(addParticipantsSchema)
    .output(chatParticipantsResponseSchema),

  removeParticipant: prefix
    .route({
      method: 'DELETE',
      path: '/chats/:chatId/participants/:participantId',
      summary: 'Remover participante',
      description: 'Remove um participante de um chat em grupo',
    })
    .input(removeParticipantSchema)
    .output(baseMessageResponseSchema),

  leaveChat: prefix
    .route({
      method: 'POST',
      path: '/chats/:chatId/leave',
      summary: 'Sair do chat',
      description: 'Sai de um chat em grupo',
    })
    .output(baseMessageResponseSchema),

  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/messages',
      summary: 'Enviar mensagem',
      description: 'Envia uma nova mensagem em um chat',
    })
    .input(sendMessageSchema)
    .output(chatMessageResponseSchema),

  listMessages: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/messages',
      summary: 'Listar mensagens',
      description: 'Lista mensagens de um chat com paginação',
    })
    .input(messagesQuerySchema)
    .output(chatMessagesListResponseSchema),

  getMessage: prefix
    .route({
      method: 'GET',
      path: '/messages/:messageId',
      summary: 'Obter mensagem',
      description: 'Obtém uma mensagem específica pelo ID',
    })
    .output(chatMessageResponseSchema),

  updateMessage: prefix
    .route({
      method: 'PATCH',
      path: '/messages/:messageId',
      summary: 'Atualizar mensagem',
      description: 'Edita uma mensagem',
    })
    .input(updateMessageSchema)
    .output(chatMessageResponseSchema),

  deleteMessage: prefix
    .route({
      method: 'DELETE',
      path: '/messages/:messageId',
      summary: 'Excluir mensagem',
      description: 'Exclui uma mensagem',
    })
    .input(deleteMessageSchema)
    .output(baseMessageResponseSchema),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/read',
      summary: 'Marcar como lida',
      description: 'Marca uma mensagem como lida',
    })
    .input(markMessageAsReadSchema)
    .output(baseMessageResponseSchema),

  sendTypingIndicator: prefix
    .route({
      method: 'POST',
      path: '/chats/:chatId/typing',
      summary: 'Enviar indicador de digitação',
      description: 'Envia indicador de digitação aos participantes do chat',
    })
    .input(typingIndicatorSchema)
    .output(baseMessageResponseSchema),

  searchMessages: prefix
    .route({
      method: 'GET',
      path: '/search/messages',
      summary: 'Buscar mensagens',
      description: 'Busca mensagens por conteúdo',
    })
    .input(searchMessagesQuerySchema)
    .output(chatMessagesListResponseSchema),

  searchChats: prefix
    .route({
      method: 'GET',
      path: '/search/chats',
      summary: 'Buscar chats',
      description: 'Busca chats por nome',
    })
    .input(searchChatsQuerySchema)
    .output(chatsListResponseSchema),

  searchUsers: prefix
    .route({
      method: 'GET',
      path: '/search/users',
      summary: 'Buscar usuários',
      description: 'Busca usuários para iniciar chat',
    })
    .input(searchUsersQuerySchema)
    .output(usersSearchResponseSchema),

  addReaction: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/reactions',
      summary: 'Adicionar reação',
      description: 'Adiciona reação emoji à mensagem',
    })
    .input(addReactionSchema)
    .output(reactionsResponseSchema),

  removeReaction: prefix
    .route({
      method: 'DELETE',
      path: '/messages/:messageId/reactions/:reactionId',
      summary: 'Remover reação',
      description: 'Remove reação da mensagem',
    })
    .input(removeReactionSchema)
    .output(baseMessageResponseSchema),

  getReactions: prefix
    .route({
      method: 'GET',
      path: '/messages/:messageId/reactions',
      summary: 'Obter reações',
      description: 'Obtém todas as reações de uma mensagem',
    })
    .output(reactionsResponseSchema),

  pinMessage: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/pin',
      summary: 'Fixar mensagem',
      description: 'Fixa uma mensagem importante no chat',
    })
    .input(pinMessageSchema)
    .output(baseMessageResponseSchema),

  unpinMessage: prefix
    .route({
      method: 'DELETE',
      path: '/messages/:messageId/pin',
      summary: 'Desafixar mensagem',
      description: 'Desafixa uma mensagem',
    })
    .input(unpinMessageSchema)
    .output(baseMessageResponseSchema),

  updateParticipantRole: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId/participants/:participantId/role',
      summary: 'Atualizar papel do participante',
      description: 'Promove ou rebaixa participante para/de admin',
    })
    .input(updateParticipantRoleSchema)
    .output(baseMessageResponseSchema),

  getChatSettings: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/settings',
      summary: 'Obter configurações do chat',
      description: 'Obtém configurações do chat em grupo',
    })
    .output(chatSettingsResponseSchema),

  updateChatSettings: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId/settings',
      summary: 'Atualizar configurações do chat',
      description: 'Atualiza descrição, regras e permissões do grupo',
    })
    .input(updateChatSettingsSchema)
    .output(chatSettingsResponseSchema),

  sendVoiceMessage: prefix
    .route({
      method: 'POST',
      path: '/messages/voice',
      summary: 'Enviar mensagem de voz',
      description: 'Envia uma mensagem de voz em um chat',
    })
    .input(sendVoiceMessageSchema)
    .output(chatMessageResponseSchema),

  forwardMessage: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/forward',
      summary: 'Encaminhar mensagem',
      description: 'Encaminha uma mensagem para um ou mais chats',
    })
    .input(forwardMessageSchema)
    .output(forwardMessageResponseSchema),

  updateGroupPermissions: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId/permissions',
      summary: 'Atualizar permissões do grupo',
      description: 'Atualiza permissões do chat em grupo',
    })
    .input(updateGroupPermissionsSchema)
    .output(groupPermissionsResponseSchema),

  getGroupPermissions: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/permissions',
      summary: 'Obter permissões do grupo',
      description: 'Obtém permissões atuais do chat em grupo',
    })
    .output(groupPermissionsResponseSchema),

  generateLinkPreview: prefix
    .route({
      method: 'POST',
      path: '/messages/link-preview',
      summary: 'Gerar preview de link',
      description: 'Gera metadados de preview para uma URL',
    })
    .input(generateLinkPreviewSchema)
    .output(linkPreviewResponseSchema),

  getUnreadCount: prefix
    .route({
      method: 'GET',
      path: '/chats/unread-count',
      summary: 'Obter contador de não lidas',
      description: 'Obtém total de mensagens não lidas em todos os chats',
    })
    .output(unreadCountResponseSchema),
})
