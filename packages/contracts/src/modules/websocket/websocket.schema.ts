import { z } from 'zod'
import { MessageType, MessageStatus } from '../chat/types'

export enum WebSocketEventType {
  JOIN_CHAT = 'JOIN_CHAT',
  LEAVE_CHAT = 'LEAVE_CHAT',
  TYPING_START = 'TYPING_START',
  TYPING_STOP = 'TYPING_STOP',
  MESSAGE_SEND = 'MESSAGE_SEND',
  MESSAGE_READ = 'MESSAGE_READ',

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

  CONNECTION_ACK = 'CONNECTION_ACK',
  ERROR = 'ERROR',
  PING = 'PING',
  PONG = 'PONG',
}

const baseWebSocketMessageSchema = z.object({
  event: z.enum(WebSocketEventType),
  timestamp: z.date(),
  requestId: z.uuid().optional(),
})

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

export const webSocketEventSchema = z.discriminatedUnion('event', [
  joinChatEventSchema,
  leaveChatEventSchema,
  typingStartEventSchema,
  typingStopEventSchema,
  messageSendEventSchema,
  messageReadEventSchema,

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

  connectionAckEventSchema,
  errorEventSchema,
  pingEventSchema,
  pongEventSchema,
])
