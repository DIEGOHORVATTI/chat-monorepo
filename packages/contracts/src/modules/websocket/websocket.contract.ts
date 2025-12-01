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
} from './websocket.schema'

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
    .input(joinChatEventSchema)
    .output(connectionAckEventSchema),

  leaveChat: prefix
    .route({
      method: 'POST',
      path: '/events/leave-chat',
      summary: 'Sair da sala de chat',
      description: 'Cancela inscrição de um chat específico',
    })
    .input(leaveChatEventSchema)
    .output(connectionAckEventSchema),

  startTyping: prefix
    .route({
      method: 'POST',
      path: '/events/typing-start',
      summary: 'Iniciar indicador de digitação',
      description: 'Notifica outros participantes que o usuário começou a digitar',
    })
    .input(typingStartEventSchema)
    .output(userTypingEventSchema),

  stopTyping: prefix
    .route({
      method: 'POST',
      path: '/events/typing-stop',
      summary: 'Parar indicador de digitação',
      description: 'Notifica outros participantes que o usuário parou de digitar',
    })
    .input(typingStopEventSchema)
    .output(userTypingEventSchema),

  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/events/message-send',
      summary: 'Enviar mensagem via WebSocket',
      description: 'Envia uma nova mensagem em tempo real',
    })
    .input(messageSendEventSchema)
    .output(messageReceivedEventSchema),

  markAsRead: prefix
    .route({
      method: 'POST',
      path: '/events/message-read',
      summary: 'Marcar mensagem como lida',
      description: 'Atualiza status da mensagem para lida e notifica o remetente',
    })
    .input(messageReadEventSchema)
    .output(messageStatusChangedEventSchema),

  ping: prefix
    .route({
      method: 'POST',
      path: '/events/ping',
      summary: 'Ping no servidor',
      description: 'Envia heartbeat para manter conexão ativa',
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
