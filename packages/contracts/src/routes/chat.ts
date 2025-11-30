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
} from '../schemas/chat'
import { messageResponseSchema as baseMessageResponseSchema } from '../schemas/identity'

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
})
