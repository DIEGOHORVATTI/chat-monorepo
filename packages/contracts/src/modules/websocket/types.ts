import type { MessageType, MessageStatus } from '../chat/types'
import type { WebSocketEventType } from './websocket.schema'

export interface BaseWebSocketMessage {
  event: WebSocketEventType
  timestamp: Date
  requestId?: string
}

export interface JoinChatEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.JOIN_CHAT
  data: {
    chatId: string
  }
}

export interface LeaveChatEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.LEAVE_CHAT
  data: {
    chatId: string
  }
}

export interface TypingStartEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.TYPING_START
  data: {
    chatId: string
  }
}

export interface TypingStopEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.TYPING_STOP
  data: {
    chatId: string
  }
}

export interface MessageSendEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_SEND
  data: {
    chatId: string
    content: string
    type: MessageType
    replyToId?: string
    metadata?: Record<string, unknown>
  }
}

export interface MessageReadEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_READ
  data: {
    messageId: string
    chatId: string
  }
}

export interface MessageReceivedEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_RECEIVED
  data: {
    messageId: string
    chatId: string
    senderId: string
    senderName: string
    senderAvatar?: string | null
    content: string
    type: MessageType
    status: MessageStatus
    replyToId?: string | null
    metadata?: Record<string, unknown>
    createdAt: Date
  }
}

export interface MessageUpdatedEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_UPDATED
  data: {
    messageId: string
    chatId: string
    content: string
    updatedAt: Date
  }
}

export interface MessageDeletedEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_DELETED
  data: {
    messageId: string
    chatId: string
    deletedAt: Date
  }
}

export interface MessageStatusChangedEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_STATUS_CHANGED
  data: {
    messageId: string
    chatId: string
    status: MessageStatus
    readBy?: Array<{
      userId: string
      readAt: Date
    }>
  }
}

export interface UserTypingEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.USER_TYPING
  data: {
    chatId: string
    userId: string
    userName: string
    isTyping: boolean
  }
}

export interface UserOnlineEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.USER_ONLINE
  data: {
    userId: string
    userName: string
    lastSeen: Date
  }
}

export interface UserOfflineEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.USER_OFFLINE
  data: {
    userId: string
    userName: string
    lastSeen: Date
  }
}

export interface ChatUpdatedEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.CHAT_UPDATED
  data: {
    chatId: string
    name?: string
    avatarUrl?: string
    updatedAt: Date
  }
}

export interface ParticipantJoinedEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.PARTICIPANT_JOINED
  data: {
    chatId: string
    userId: string
    userName: string
    userAvatar?: string | null
    role: 'admin' | 'member'
    joinedAt: Date
  }
}

export interface ParticipantLeftEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.PARTICIPANT_LEFT
  data: {
    chatId: string
    userId: string
    userName: string
    leftAt: Date
  }
}

export interface MessageDeliveredEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_DELIVERED
  data: {
    messageId: string
    chatId: string
    deliveredAt: Date
  }
}

export interface MessageSeenEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.MESSAGE_SEEN
  data: {
    messageId: string
    chatId: string
    seenAt: Date
    seenBy: string
  }
}

export interface ReconnectEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.RECONNECT
  data: {
    lastEventId?: string
    disconnectedAt: Date
  }
}

export interface SyncMissedEventsEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.SYNC_MISSED_EVENTS
  data: {
    events: Array<
      | MessageReceivedEvent
      | MessageUpdatedEvent
      | MessageDeletedEvent
      | MessageStatusChangedEvent
      | MessageDeliveredEvent
      | MessageSeenEvent
      | UserTypingEvent
      | UserOnlineEvent
      | UserOfflineEvent
      | ChatUpdatedEvent
      | ParticipantJoinedEvent
      | ParticipantLeftEvent
    >
    lastEventId: string
  }
}

export interface ConnectionAckEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.CONNECTION_ACK
  data: {
    userId: string
    sessionId: string
    connectedAt: Date
  }
}

export interface ErrorEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.ERROR
  data: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface PingEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.PING
  data?: {}
}

export interface PongEvent extends BaseWebSocketMessage {
  event: WebSocketEventType.PONG
  data?: {
    latency?: number
  }
}

export type WebSocketEvent =
  | JoinChatEvent
  | LeaveChatEvent
  | TypingStartEvent
  | TypingStopEvent
  | MessageSendEvent
  | MessageReadEvent
  | MessageReceivedEvent
  | MessageUpdatedEvent
  | MessageDeletedEvent
  | MessageStatusChangedEvent
  | UserTypingEvent
  | UserOnlineEvent
  | UserOfflineEvent
  | ChatUpdatedEvent
  | ParticipantJoinedEvent
  | ParticipantLeftEvent
  | ConnectionAckEvent
  | ErrorEvent
  | PingEvent
  | PongEvent
  | MessageDeliveredEvent
  | MessageSeenEvent
  | ReconnectEvent
  | SyncMissedEventsEvent
