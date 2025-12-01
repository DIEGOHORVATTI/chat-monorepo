import { oc } from '@orpc/contract'

import {
  sendMessageSchema,
  updateMessageSchema,
  deleteMessageSchema,
  markMessageAsReadSchema,
  messagesQuerySchema,
  chatMessageResponseSchema,
  chatMessagesListResponseSchema,
  createChatSchema,
  chatQuerySchema,
  chatResponseSchema,
  chatsListResponseSchema,
  addParticipantsSchema,
  removeParticipantSchema,
  updateChatSchema,
  chatParticipantsResponseSchema,
  typingIndicatorSchema,
  searchMessagesQuerySchema,
  searchChatsQuerySchema,
  searchUsersQuerySchema,
  addReactionSchema,
  removeReactionSchema,
  pinMessageSchema,
  unpinMessageSchema,
  updateParticipantRoleSchema,
  updateChatSettingsSchema,
  reactionsResponseSchema,
  chatSettingsResponseSchema,
  usersSearchResponseSchema,
  sendVoiceMessageSchema,
  forwardMessageSchema,
  forwardMessageResponseSchema,
  updateGroupPermissionsSchema,
  groupPermissionsResponseSchema,
  generateLinkPreviewSchema,
  linkPreviewResponseSchema,
  leaveChatSchema,
  unreadCountResponseSchema,
} from './chat.schema'
import { messageResponseSchema as baseMessageResponseSchema } from '../identity/identity.schema'

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
