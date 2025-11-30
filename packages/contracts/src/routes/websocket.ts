import { oc } from '@orpc/contract'
import {
  joinChatEventSchema,
  leaveChatEventSchema,
  typingStartEventSchema,
  typingStopEventSchema,
  messageSendEventSchema,
  messageReadEventSchema,
  messageReceivedEventSchema,
  messageStatusChangedEventSchema,
  userTypingEventSchema,
  connectionAckEventSchema,
  pingEventSchema,
  pongEventSchema,
  WebSocketEventType,
} from '../schemas/websocket'

const prefix = oc.route({ tags: ['WebSocket'] })

/**
 * WebSocket event handlers
 *
 * Connection URL: ws://your-domain/ws
 * Authentication: JWT token via query parameter or Authorization header
 *
 * Example connection:
 * ```typescript
 * const ws = new WebSocket('ws://localhost:3000/ws?token=YOUR_JWT_TOKEN')
 * ```
 *
 * All messages should be sent as JSON strings
 */
export const websocket = oc.prefix('/ws').router({
  connect: prefix
    .route({
      method: 'GET',
      path: '/',
      summary: 'WebSocket connection endpoint',
      description:
        'Establish WebSocket connection for real-time chat updates. Requires authentication via JWT token.',
    })
    .output(connectionAckEventSchema),

  joinChat: prefix
    .route({
      method: 'POST',
      path: '/events/join-chat',
      summary: 'Join chat room',
      description: 'Subscribe to a specific chat for real-time updates',
    })
    .input(joinChatEventSchema)
    .output(connectionAckEventSchema),

  leaveChat: prefix
    .route({
      method: 'POST',
      path: '/events/leave-chat',
      summary: 'Leave chat room',
      description: 'Unsubscribe from a specific chat',
    })
    .input(leaveChatEventSchema)
    .output(connectionAckEventSchema),

  startTyping: prefix
    .route({
      method: 'POST',
      path: '/events/typing-start',
      summary: 'Start typing indicator',
      description: 'Notify other participants that user started typing',
    })
    .input(typingStartEventSchema)
    .output(userTypingEventSchema),

  stopTyping: prefix
    .route({
      method: 'POST',
      path: '/events/typing-stop',
      summary: 'Stop typing indicator',
      description: 'Notify other participants that user stopped typing',
    })
    .input(typingStopEventSchema)
    .output(userTypingEventSchema),

  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/events/message-send',
      summary: 'Send message via WebSocket',
      description: 'Send a new message in real-time',
    })
    .input(messageSendEventSchema)
    .output(messageReceivedEventSchema),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/events/message-read',
      summary: 'Mark message as read',
      description: 'Update message status to read and notify sender',
    })
    .input(messageReadEventSchema)
    .output(messageStatusChangedEventSchema),

  ping: prefix
    .route({
      method: 'POST',
      path: '/events/ping',
      summary: 'Ping server',
      description: 'Send heartbeat to keep connection alive',
    })
    .input(pingEventSchema)
    .output(pongEventSchema),
})

/**
 * WebSocket Event Documentation
 *
 * CLIENT -> SERVER Events:
 * - JOIN_CHAT: Subscribe to chat updates
 * - LEAVE_CHAT: Unsubscribe from chat
 * - TYPING_START: User started typing
 * - TYPING_STOP: User stopped typing
 * - MESSAGE_SEND: Send new message
 * - MESSAGE_READ: Mark message as read
 * - PING: Heartbeat check
 *
 * SERVER -> CLIENT Events:
 * - CONNECTION_ACK: Connection established
 * - MESSAGE_RECEIVED: New message in chat
 * - MESSAGE_UPDATED: Message was edited
 * - MESSAGE_DELETED: Message was deleted
 * - MESSAGE_STATUS_CHANGED: Message delivery/read status changed
 * - USER_TYPING: Another user is typing
 * - USER_ONLINE: User came online
 * - USER_OFFLINE: User went offline
 * - CHAT_UPDATED: Chat details changed
 * - PARTICIPANT_JOINED: New participant joined
 * - PARTICIPANT_LEFT: Participant left chat
 * - ERROR: Error occurred
 * - PONG: Response to ping
 *
 */
export const websocketEvents = {
  types: WebSocketEventType,

  clientEvents: [
    WebSocketEventType.JOIN_CHAT,
    WebSocketEventType.LEAVE_CHAT,
    WebSocketEventType.TYPING_START,
    WebSocketEventType.TYPING_STOP,
    WebSocketEventType.MESSAGE_SEND,
    WebSocketEventType.MESSAGE_READ,
    WebSocketEventType.PING,
  ] as const,

  serverEvents: [
    WebSocketEventType.CONNECTION_ACK,
    WebSocketEventType.MESSAGE_RECEIVED,
    WebSocketEventType.MESSAGE_UPDATED,
    WebSocketEventType.MESSAGE_DELETED,
    WebSocketEventType.MESSAGE_STATUS_CHANGED,
    WebSocketEventType.USER_TYPING,
    WebSocketEventType.USER_ONLINE,
    WebSocketEventType.USER_OFFLINE,
    WebSocketEventType.CHAT_UPDATED,
    WebSocketEventType.PARTICIPANT_JOINED,
    WebSocketEventType.PARTICIPANT_LEFT,
    WebSocketEventType.ERROR,
    WebSocketEventType.PONG,
  ] as const,
}
