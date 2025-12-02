import { oc } from '@orpc/contract'
import { z } from 'zod'

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

enum WebSocketEventType {
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
  MESSAGE_DELIVERED = 'MESSAGE_DELIVERED',
  MESSAGE_SEEN = 'MESSAGE_SEEN',
  USER_TYPING = 'USER_TYPING',
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  CHAT_UPDATED = 'CHAT_UPDATED',
  PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',

  CALL_INCOMING = 'CALL_INCOMING',
  CALL_STARTED = 'CALL_STARTED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_PARTICIPANT_JOINED = 'CALL_PARTICIPANT_JOINED',
  CALL_PARTICIPANT_LEFT = 'CALL_PARTICIPANT_LEFT',
  CALL_PARTICIPANT_MEDIA_CHANGED = 'CALL_PARTICIPANT_MEDIA_CHANGED',

  NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED',
  NOTIFICATION_READ = 'NOTIFICATION_READ',
  NOTIFICATION_DELETED = 'NOTIFICATION_DELETED',

  CONNECTION_ACK = 'CONNECTION_ACK',
  RECONNECT = 'RECONNECT',
  SYNC_MISSED_EVENTS = 'SYNC_MISSED_EVENTS',
  ERROR = 'ERROR',
  PING = 'PING',
  PONG = 'PONG',
}

const baseWebSocketMessageSchema = z.object({
  event: z.enum(WebSocketEventType),
  timestamp: z.date(),
  requestId: z.uuid().optional(),
})

const userTypingEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.USER_TYPING),
  data: z.object({
    chatId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    isTyping: z.boolean(),
  }),
})

const connectionAckEventSchema = baseWebSocketMessageSchema.extend({
  event: z.literal(WebSocketEventType.CONNECTION_ACK),
  data: z.object({
    userId: z.uuid(),
    sessionId: z.uuid(),
    connectedAt: z.date(),
  }),
})

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
      summary: 'Endpoint de conexão WebSocket',
      description:
        'Estabelece conexão WebSocket para atualizações de chat em tempo real. Requer autenticação via token JWT.',
    })
    .output(connectionAckEventSchema),

  joinChat: prefix
    .route({
      method: 'POST',
      path: '/events/join-chat',
      summary: 'Entrar na sala de chat',
      description: 'Inscreve-se em um chat específico para atualizações em tempo real',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.JOIN_CHAT),
        data: z.object({
          chatId: z.uuid(),
        }),
      })
    )
    .output(connectionAckEventSchema),

  leaveChat: prefix
    .route({
      method: 'POST',
      path: '/events/leave-chat',
      summary: 'Sair da sala de chat',
      description: 'Cancela inscrição de um chat específico',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.LEAVE_CHAT),
        data: z.object({
          chatId: z.uuid(),
        }),
      })
    )
    .output(connectionAckEventSchema),

  startTyping: prefix
    .route({
      method: 'POST',
      path: '/events/typing-start',
      summary: 'Iniciar indicador de digitação',
      description: 'Notifica outros participantes que o usuário começou a digitar',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.TYPING_START),
        data: z.object({
          chatId: z.uuid(),
        }),
      })
    )
    .output(userTypingEventSchema),

  stopTyping: prefix
    .route({
      method: 'POST',
      path: '/events/typing-stop',
      summary: 'Parar indicador de digitação',
      description: 'Notifica outros participantes que o usuário parou de digitar',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.TYPING_STOP),
        data: z.object({
          chatId: z.uuid(),
        }),
      })
    )
    .output(userTypingEventSchema),

  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/events/message-send',
      summary: 'Enviar mensagem via WebSocket',
      description: 'Envia uma nova mensagem em tempo real',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.MESSAGE_SEND),
        data: z.object({
          chatId: z.uuid(),
          content: z.string().min(1),
          type: z.enum(MessageType).default(MessageType.TEXT),
          replyToId: z.uuid().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        }),
      })
    )
    .output(
      baseWebSocketMessageSchema.extend({
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
    ),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/events/message-read',
      summary: 'Marcar mensagem como lida',
      description: 'Atualiza status da mensagem para lida e notifica o remetente',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.MESSAGE_READ),
        data: z.object({
          messageId: z.uuid(),
          chatId: z.uuid(),
        }),
      })
    )
    .output(
      baseWebSocketMessageSchema.extend({
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
    ),

  ping: prefix
    .route({
      method: 'POST',
      path: '/events/ping',
      summary: 'Ping no servidor',
      description: 'Envia heartbeat para manter conexão ativa',
    })
    .input(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.PING),
        data: z.object({}).optional(),
      })
    )
    .output(
      baseWebSocketMessageSchema.extend({
        event: z.literal(WebSocketEventType.PONG),
        data: z
          .object({
            latency: z.number().optional(),
          })
          .optional(),
      })
    ),
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
 * - MESSAGE_DELIVERED: Message delivered to server
 * - MESSAGE_SEEN: Message seen by recipient
 * - USER_TYPING: Another user is typing
 * - USER_ONLINE: User came online
 * - USER_OFFLINE: User went offline
 * - CHAT_UPDATED: Chat details changed
 * - PARTICIPANT_JOINED: New participant joined
 * - PARTICIPANT_LEFT: Participant left chat
 * - CALL_INCOMING: Incoming call notification
 * - CALL_STARTED: Call has started
 * - CALL_ENDED: Call has ended
 * - CALL_PARTICIPANT_JOINED: Participant joined call
 * - CALL_PARTICIPANT_LEFT: Participant left call
 * - CALL_PARTICIPANT_MEDIA_CHANGED: Participant changed media settings
 * - RECONNECT: Reconnection event
 * - SYNC_MISSED_EVENTS: Sync events missed during disconnect
 * - ERROR: Error occurred
 * - PONG: Response to ping
 *
 */
const websocketEvents = {
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
    WebSocketEventType.MESSAGE_DELIVERED,
    WebSocketEventType.MESSAGE_SEEN,
    WebSocketEventType.USER_TYPING,
    WebSocketEventType.USER_ONLINE,
    WebSocketEventType.USER_OFFLINE,
    WebSocketEventType.CHAT_UPDATED,
    WebSocketEventType.PARTICIPANT_JOINED,
    WebSocketEventType.PARTICIPANT_LEFT,
    WebSocketEventType.CALL_INCOMING,
    WebSocketEventType.CALL_STARTED,
    WebSocketEventType.CALL_ENDED,
    WebSocketEventType.CALL_PARTICIPANT_JOINED,
    WebSocketEventType.CALL_PARTICIPANT_LEFT,
    WebSocketEventType.CALL_PARTICIPANT_MEDIA_CHANGED,
    WebSocketEventType.RECONNECT,
    WebSocketEventType.SYNC_MISSED_EVENTS,
    WebSocketEventType.ERROR,
    WebSocketEventType.PONG,
  ] as const,
}
