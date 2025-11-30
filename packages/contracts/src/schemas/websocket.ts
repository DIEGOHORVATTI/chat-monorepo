import { z } from 'zod'
import { MessageType, MessageStatus } from './chat'

export enum WebSocketEventType {
  // Client to Server events
  JOIN_CHAT = 'JOIN_CHAT',
  LEAVE_CHAT = 'LEAVE_CHAT',
  TYPING_START = 'TYPING_START',
  TYPING_STOP = 'TYPING_STOP',
  MESSAGE_SEND = 'MESSAGE_SEND',
  MESSAGE_READ = 'MESSAGE_READ',

  // Server to Client events
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  MESSAGE_UPDATED = 'MESSAGE_UPDATED',
  MESSAGE_DELETED = 'MESSAGE_DELETED',
  MESSAGE_STATUS_CHANGED = 'MESSAGE_STATUS_CHANGED',
  USER_TYPING = 'USER_TYPING',
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  CHAT_UPDATED = 'CHAT_UPDATED',
  PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',

  // System events
  CONNECTION_ACK = 'CONNECTION_ACK',
  ERROR = 'ERROR',
  PING = 'PING',
  PONG = 'PONG',
}

// Base WebSocket message structure
const baseWebSocketMessageSchema = z.object({
  event: z.enum(WebSocketEventType),
  timestamp: z.date(),
  requestId: z.uuid().optional(),
})

// Client to Server Events
export const joinChatEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.JOIN_CHAT),
  data: z.object({
    chatId: z.uuid(),
  }),
})

export const leaveChatEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.LEAVE_CHAT),
  data: z.object({
    chatId: z.uuid(),
  }),
})

export const typingStartEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.TYPING_START),
  data: z.object({
    chatId: z.uuid(),
  }),
})

export const typingStopEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.TYPING_STOP),
  data: z.object({
    chatId: z.uuid(),
  }),
})

export const messageSendEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_SEND),
  data: z.object({
    chatId: z.uuid(),
    content: z.string().min(1),
    type: z.enum(MessageType).default(MessageType.TEXT),
    replyToId: z.uuid().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
})

export const messageReadEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_READ),
  data: z.object({
    messageId: z.uuid(),
    chatId: z.uuid(),
  }),
})

// Server to Client Events
export const messageReceivedEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_RECEIVED),
  data: z.object({
    messageId: z.uuid(),
    chatId: z.uuid(),
    senderId: z.uuid(),
    senderName: z.string(),
    senderAvatar: z.url().nullable().optional(),
    content: z.string(),
    type: z.enum(MessageType),
    status: z.enum(MessageStatus),
    replyToId: z.uuid().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
  }),
})

export const messageUpdatedEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_UPDATED),
  data: z.object({
    messageId: z.uuid(),
    chatId: z.uuid(),
    content: z.string(),
    updatedAt: z.date(),
  }),
})

export const messageDeletedEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_DELETED),
  data: z.object({
    messageId: z.uuid(),
    chatId: z.uuid(),
    deletedAt: z.date(),
  }),
})

export const messageStatusChangedEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_STATUS_CHANGED),
  data: z.object({
    messageId: z.uuid(),
    chatId: z.uuid(),
    status: z.enum(MessageStatus),
    readBy: z
      .array(
        z.object({
          userId: z.uuid(),
          readAt: z.date(),
        })
      )
      .optional(),
  }),
})

export const userTypingEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.USER_TYPING),
  data: z.object({
    chatId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    isTyping: z.boolean(),
  }),
})

export const userOnlineEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.USER_ONLINE),
  data: z.object({
    userId: z.uuid(),
    userName: z.string(),
    lastSeen: z.date(),
  }),
})

export const userOfflineEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.USER_OFFLINE),
  data: z.object({
    userId: z.uuid(),
    userName: z.string(),
    lastSeen: z.date(),
  }),
})

export const chatUpdatedEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.CHAT_UPDATED),
  data: z.object({
    chatId: z.uuid(),
    name: z.string().optional(),
    avatarUrl: z.url().optional(),
    updatedAt: z.date(),
  }),
})

export const participantJoinedEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.PARTICIPANT_JOINED),
  data: z.object({
    chatId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    userAvatar: z.url().nullable().optional(),
    role: z.enum(['admin', 'member']),
    joinedAt: z.date(),
  }),
})

export const participantLeftEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.PARTICIPANT_LEFT),
  data: z.object({
    chatId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    leftAt: z.date(),
  }),
})

// System Events
export const connectionAckEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.CONNECTION_ACK),
  data: z.object({
    userId: z.uuid(),
    sessionId: z.uuid(),
    connectedAt: z.date(),
  }),
})

export const errorEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.ERROR),
  data: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
})

export const pingEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.PING),
  data: z.object({}).optional(),
})

export const pongEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.PONG),
  data: z
    .object({
      latency: z.number().optional(),
    })
    .optional(),
})

// Union type for all WebSocket events
export const webSocketEventSchema = z.discriminatedUnion('event', [
  // Client to Server
  joinChatEventSchema,
  leaveChatEventSchema,
  typingStartEventSchema,
  typingStopEventSchema,
  messageSendEventSchema,
  messageReadEventSchema,

  // Server to Client
  messageReceivedEventSchema,
  messageUpdatedEventSchema,
  messageDeletedEventSchema,
  messageStatusChangedEventSchema,
  userTypingEventSchema,
  userOnlineEventSchema,
  userOfflineEventSchema,
  chatUpdatedEventSchema,
  participantJoinedEventSchema,
  participantLeftEventSchema,

  // System
  connectionAckEventSchema,
  errorEventSchema,
  pingEventSchema,
  pongEventSchema,
])

// Type exports
export type JoinChatEvent = z.infer<typeof joinChatEventSchema>
export type LeaveChatEvent = z.infer<typeof leaveChatEventSchema>
export type TypingStartEvent = z.infer<typeof typingStartEventSchema>
export type TypingStopEvent = z.infer<typeof typingStopEventSchema>
export type MessageSendEvent = z.infer<typeof messageSendEventSchema>
export type MessageReadEvent = z.infer<typeof messageReadEventSchema>
export type MessageReceivedEvent = z.infer<typeof messageReceivedEventSchema>
export type MessageUpdatedEvent = z.infer<typeof messageUpdatedEventSchema>
export type MessageDeletedEvent = z.infer<typeof messageDeletedEventSchema>
export type MessageStatusChangedEvent = z.infer<typeof messageStatusChangedEventSchema>
export type UserTypingEvent = z.infer<typeof userTypingEventSchema>
export type UserOnlineEvent = z.infer<typeof userOnlineEventSchema>
export type UserOfflineEvent = z.infer<typeof userOfflineEventSchema>
export type ChatUpdatedEvent = z.infer<typeof chatUpdatedEventSchema>
export type ParticipantJoinedEvent = z.infer<typeof participantJoinedEventSchema>
export type ParticipantLeftEvent = z.infer<typeof participantLeftEventSchema>
export type ConnectionAckEvent = z.infer<typeof connectionAckEventSchema>
export type ErrorEvent = z.infer<typeof errorEventSchema>
export type PingEvent = z.infer<typeof pingEventSchema>
export type PongEvent = z.infer<typeof pongEventSchema>
export type WebSocketEvent = z.infer<typeof webSocketEventSchema>
