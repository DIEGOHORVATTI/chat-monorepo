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
      summary: 'Create chat',
      description: 'Create a new chat (direct or group)',
    })
    .input(createChatSchema)
    .output(chatResponseSchema),

  listChats: prefix
    .route({
      method: 'GET',
      path: '/chats',
      summary: 'List chats',
      description: 'List all chats for the current user',
    })
    .input(chatQuerySchema)
    .output(chatsListResponseSchema),

  getChat: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId',
      summary: 'Get chat',
      description: 'Get a specific chat by ID',
    })
    .output(chatResponseSchema),

  updateChat: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId',
      summary: 'Update chat',
      description: 'Update chat details (name, avatar)',
    })
    .input(updateChatSchema)
    .output(chatResponseSchema),

  deleteChat: prefix
    .route({
      method: 'DELETE',
      path: '/chats/:chatId',
      summary: 'Delete chat',
      description: 'Delete a chat',
    })
    .output(baseMessageResponseSchema),

  addParticipants: prefix
    .route({
      method: 'POST',
      path: '/chats/:chatId/participants',
      summary: 'Add participants',
      description: 'Add participants to a group chat',
    })
    .input(addParticipantsSchema)
    .output(chatParticipantsResponseSchema),

  removeParticipant: prefix
    .route({
      method: 'DELETE',
      path: '/chats/:chatId/participants/:participantId',
      summary: 'Remove participant',
      description: 'Remove a participant from a group chat',
    })
    .input(removeParticipantSchema)
    .output(baseMessageResponseSchema),

  leaveChat: prefix
    .route({
      method: 'POST',
      path: '/chats/:chatId/leave',
      summary: 'Leave chat',
      description: 'Leave a group chat',
    })
    .output(baseMessageResponseSchema),

  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/messages',
      summary: 'Send message',
      description: 'Send a new message in a chat',
    })
    .input(sendMessageSchema)
    .output(chatMessageResponseSchema),

  listMessages: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/messages',
      summary: 'List messages',
      description: 'List messages in a chat with pagination',
    })
    .input(messagesQuerySchema)
    .output(chatMessagesListResponseSchema),

  getMessage: prefix
    .route({
      method: 'GET',
      path: '/messages/:messageId',
      summary: 'Get message',
      description: 'Get a specific message by ID',
    })
    .output(chatMessageResponseSchema),

  updateMessage: prefix
    .route({
      method: 'PATCH',
      path: '/messages/:messageId',
      summary: 'Update message',
      description: 'Edit a message',
    })
    .input(updateMessageSchema)
    .output(chatMessageResponseSchema),

  deleteMessage: prefix
    .route({
      method: 'DELETE',
      path: '/messages/:messageId',
      summary: 'Delete message',
      description: 'Delete a message',
    })
    .input(deleteMessageSchema)
    .output(baseMessageResponseSchema),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/read',
      summary: 'Mark as read',
      description: 'Mark a message as read',
    })
    .input(markMessageAsReadSchema)
    .output(baseMessageResponseSchema),

  sendTypingIndicator: prefix
    .route({
      method: 'POST',
      path: '/chats/:chatId/typing',
      summary: 'Send typing indicator',
      description: 'Send typing indicator to chat participants',
    })
    .input(typingIndicatorSchema)
    .output(baseMessageResponseSchema),

  searchMessages: prefix
    .route({
      method: 'GET',
      path: '/search/messages',
      summary: 'Search messages',
      description: 'Search messages by content',
    })
    .input(searchMessagesQuerySchema)
    .output(chatMessagesListResponseSchema),

  searchChats: prefix
    .route({
      method: 'GET',
      path: '/search/chats',
      summary: 'Search chats',
      description: 'Search chats by name',
    })
    .input(searchChatsQuerySchema)
    .output(chatsListResponseSchema),

  searchUsers: prefix
    .route({
      method: 'GET',
      path: '/search/users',
      summary: 'Search users',
      description: 'Search users to start chat',
    })
    .input(searchUsersQuerySchema)
    .output(usersSearchResponseSchema),

  addReaction: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/reactions',
      summary: 'Add reaction',
      description: 'Add emoji reaction to message',
    })
    .input(addReactionSchema)
    .output(reactionsResponseSchema),

  removeReaction: prefix
    .route({
      method: 'DELETE',
      path: '/messages/:messageId/reactions/:reactionId',
      summary: 'Remove reaction',
      description: 'Remove reaction from message',
    })
    .input(removeReactionSchema)
    .output(baseMessageResponseSchema),

  getReactions: prefix
    .route({
      method: 'GET',
      path: '/messages/:messageId/reactions',
      summary: 'Get reactions',
      description: 'Get all reactions for a message',
    })
    .output(reactionsResponseSchema),

  pinMessage: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/pin',
      summary: 'Pin message',
      description: 'Pin an important message in chat',
    })
    .input(pinMessageSchema)
    .output(baseMessageResponseSchema),

  unpinMessage: prefix
    .route({
      method: 'DELETE',
      path: '/messages/:messageId/pin',
      summary: 'Unpin message',
      description: 'Unpin a message',
    })
    .input(unpinMessageSchema)
    .output(baseMessageResponseSchema),

  updateParticipantRole: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId/participants/:participantId/role',
      summary: 'Update participant role',
      description: 'Promote or demote participant to/from admin',
    })
    .input(updateParticipantRoleSchema)
    .output(baseMessageResponseSchema),

  getChatSettings: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/settings',
      summary: 'Get chat settings',
      description: 'Get group chat settings',
    })
    .output(chatSettingsResponseSchema),

  updateChatSettings: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId/settings',
      summary: 'Update chat settings',
      description: 'Update group description, rules, permissions',
    })
    .input(updateChatSettingsSchema)
    .output(chatSettingsResponseSchema),

  sendVoiceMessage: prefix
    .route({
      method: 'POST',
      path: '/messages/voice',
      summary: 'Send voice message',
      description: 'Send a voice message in a chat',
    })
    .input(sendVoiceMessageSchema)
    .output(chatMessageResponseSchema),

  forwardMessage: prefix
    .route({
      method: 'POST',
      path: '/messages/:messageId/forward',
      summary: 'Forward message',
      description: 'Forward a message to one or more chats',
    })
    .input(forwardMessageSchema)
    .output(forwardMessageResponseSchema),

  updateGroupPermissions: prefix
    .route({
      method: 'PATCH',
      path: '/chats/:chatId/permissions',
      summary: 'Update group permissions',
      description: 'Update permissions for group chat',
    })
    .input(updateGroupPermissionsSchema)
    .output(groupPermissionsResponseSchema),

  getGroupPermissions: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/permissions',
      summary: 'Get group permissions',
      description: 'Get current permissions for group chat',
    })
    .output(groupPermissionsResponseSchema),

  generateLinkPreview: prefix
    .route({
      method: 'POST',
      path: '/messages/link-preview',
      summary: 'Generate link preview',
      description: 'Generate preview metadata for a URL',
    })
    .input(generateLinkPreviewSchema)
    .output(linkPreviewResponseSchema),

  getUnreadCount: prefix
    .route({
      method: 'GET',
      path: '/chats/unread-count',
      summary: 'Get unread count',
      description: 'Get total unread message count across all chats',
    })
    .output(unreadCountResponseSchema),
})
