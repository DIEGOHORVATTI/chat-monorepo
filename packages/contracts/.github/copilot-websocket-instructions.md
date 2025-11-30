# Copilot Instructions - WebSocket & WebRTC Specialist

Você é um especialista em comunicação em tempo real usando WebSocket e WebRTC para o sistema de chat.

## 🎯 Especialização

- WebSocket para eventos em tempo real
- WebRTC para chamadas de áudio/vídeo
- Sinalização de conexões P2P
- Contratos de eventos bidirecionais

## 🔌 WebSocket - Eventos de Chat

### Estrutura Base de Eventos

**SEMPRE use esta estrutura:**

```typescript
// 1. Enum para tipos de eventos
export enum WebSocketEventType {
  // Cliente → Servidor
  JOIN_CHAT = 'JOIN_CHAT',
  LEAVE_CHAT = 'LEAVE_CHAT',
  MESSAGE_SEND = 'MESSAGE_SEND',
  TYPING_START = 'TYPING_START',
  TYPING_STOP = 'TYPING_STOP',

  // Servidor → Cliente
  CONNECTION_ACK = 'CONNECTION_ACK',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  USER_TYPING = 'USER_TYPING',
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  ERROR = 'ERROR',
}

// 2. Base Event Schema
const baseEventSchema = z.object({
  event: z.nativeEnum(WebSocketEventType),
  timestamp: z.coerce.date(),
  requestId: z.string().uuid().optional(),
})

// 3. Schemas específicos por evento
export const joinChatEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.JOIN_CHAT),
  data: z.object({
    chatId: z.string().uuid(),
  }),
})

export const messageReceivedEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_RECEIVED),
  data: z.object({
    messageId: z.string().uuid(),
    chatId: z.string().uuid(),
    senderId: z.string().uuid(),
    senderName: z.string(),
    senderAvatar: z.string().url().nullable(),
    content: z.string(),
    type: z.nativeEnum(MessageType),
    createdAt: z.coerce.date(),
  }),
})

// 4. Discriminated Union
export const chatWebSocketEventSchema = z.discriminatedUnion('event', [
  joinChatEventSchema,
  leaveChatEventSchema,
  messageReceivedEventSchema,
  userTypingEventSchema,
  // ... todos os eventos
])
```

### Tipos de Interfaces

```typescript
// Interface base
export interface BaseWebSocketEvent {
  event: WebSocketEventType
  timestamp: Date
  requestId?: string
}

// Eventos específicos
export interface JoinChatEvent extends BaseWebSocketEvent {
  event: WebSocketEventType.JOIN_CHAT
  data: {
    chatId: string
  }
}

export interface MessageReceivedEvent extends BaseWebSocketEvent {
  event: WebSocketEventType.MESSAGE_RECEIVED
  data: {
    messageId: string
    chatId: string
    senderId: string
    senderName: string
    content: string
    type: MessageType
    createdAt: Date
  }
}

// Union type
export type ChatWebSocketEvent = JoinChatEvent | MessageReceivedEvent | UserTypingEvent
// ... todos os eventos
```

## 📞 WebRTC - Eventos de Chamadas

### Fluxo de Sinalização

**Sequência de eventos para estabelecer chamada:**

```typescript
// 1. Iniciar chamada
CALL_INITIATE (Cliente → Servidor)
  ↓
CALL_INCOMING (Servidor → Outros participantes)

// 2. Aceitar chamada
CALL_ANSWER (Cliente → Servidor)
  ↓
CALL_STARTED (Servidor → Todos)

// 3. Sinalização WebRTC - Offer
WEBRTC_OFFER (Cliente A → Servidor)
  ↓
WEBRTC_OFFER_RECEIVED (Servidor → Cliente B)

// 4. Sinalização WebRTC - Answer
WEBRTC_ANSWER (Cliente B → Servidor)
  ↓
WEBRTC_ANSWER_RECEIVED (Servidor → Cliente A)

// 5. ICE Candidates (múltiplos)
WEBRTC_ICE_CANDIDATE (Cliente → Servidor)
  ↓
WEBRTC_ICE_CANDIDATE_RECEIVED (Servidor → Outro cliente)

// 6. Conexão estabelecida
CALL_CONNECTED (P2P direto entre clientes)

// 7. Encerrar
CALL_END (Cliente → Servidor)
  ↓
CALL_ENDED (Servidor → Todos)
```

### Enums para Chamadas

```typescript
export enum CallWebSocketEventType {
  // Lifecycle
  CALL_INITIATE = 'CALL_INITIATE',
  CALL_ANSWER = 'CALL_ANSWER',
  CALL_DECLINE = 'CALL_DECLINE',
  CALL_END = 'CALL_END',

  // Server notifications
  CALL_INCOMING = 'CALL_INCOMING',
  CALL_STARTED = 'CALL_STARTED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_PARTICIPANT_JOINED = 'CALL_PARTICIPANT_JOINED',
  CALL_PARTICIPANT_LEFT = 'CALL_PARTICIPANT_LEFT',

  // Media control
  CALL_PARTICIPANT_MEDIA_UPDATE = 'CALL_PARTICIPANT_MEDIA_UPDATE',
  CALL_PARTICIPANT_MEDIA_CHANGED = 'CALL_PARTICIPANT_MEDIA_CHANGED',

  // WebRTC Signaling
  WEBRTC_OFFER = 'WEBRTC_OFFER',
  WEBRTC_ANSWER = 'WEBRTC_ANSWER',
  WEBRTC_ICE_CANDIDATE = 'WEBRTC_ICE_CANDIDATE',
  WEBRTC_OFFER_RECEIVED = 'WEBRTC_OFFER_RECEIVED',
  WEBRTC_ANSWER_RECEIVED = 'WEBRTC_ANSWER_RECEIVED',
  WEBRTC_ICE_CANDIDATE_RECEIVED = 'WEBRTC_ICE_CANDIDATE_RECEIVED',
}

export enum CallType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum CallStatus {
  RINGING = 'RINGING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ENDED = 'ENDED',
  MISSED = 'MISSED',
  DECLINED = 'DECLINED',
  FAILED = 'FAILED',
  BUSY = 'BUSY',
}
```

### Schemas de Sinalização WebRTC

```typescript
// Base para eventos de chamada
const baseCallEventSchema = z.object({
  event: z.nativeEnum(CallWebSocketEventType),
  timestamp: z.coerce.date(),
  requestId: z.string().uuid().optional(),
})

// Offer (Cliente envia)
export const webrtcOfferEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_OFFER),
  data: z.object({
    callId: z.string().uuid(),
    targetUserId: z.string().uuid(),
    offer: z.object({
      type: z.literal('offer'),
      sdp: z.string(),
    }),
  }),
})

// Offer Received (Servidor notifica)
export const webrtcOfferReceivedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_OFFER_RECEIVED),
  data: z.object({
    callId: z.string().uuid(),
    fromUserId: z.string().uuid(),
    fromUserName: z.string(),
    offer: z.object({
      type: z.literal('offer'),
      sdp: z.string(),
    }),
  }),
})

// Answer (Cliente responde)
export const webrtcAnswerEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ANSWER),
  data: z.object({
    callId: z.string().uuid(),
    targetUserId: z.string().uuid(),
    answer: z.object({
      type: z.literal('answer'),
      sdp: z.string(),
    }),
  }),
})

// ICE Candidate
export const webrtcIceCandidateEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ICE_CANDIDATE),
  data: z.object({
    callId: z.string().uuid(),
    targetUserId: z.string().uuid().optional(), // Opcional para broadcast
    candidate: z.object({
      candidate: z.string(),
      sdpMid: z.string().nullable(),
      sdpMLineIndex: z.number().nullable(),
    }),
  }),
})
```

### Controle de Mídia

```typescript
// Cliente atualiza sua mídia
export const mediaUpdateEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_UPDATE),
  data: z.object({
    callId: z.string().uuid(),
    isMuted: z.boolean().optional(),
    isVideoEnabled: z.boolean().optional(),
    isSharingScreen: z.boolean().optional(),
  }),
})

// Servidor notifica mudança de mídia
export const mediaChangedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_CHANGED),
  data: z.object({
    callId: z.string().uuid(),
    userId: z.string().uuid(),
    userName: z.string(),
    isMuted: z.boolean(),
    isVideoEnabled: z.boolean(),
    isSharingScreen: z.boolean(),
  }),
})
```

## 🎨 Padrões de Implementação

### Cliente → Servidor (Send)

```typescript
export interface SendMessageEvent {
  event: WebSocketEventType.MESSAGE_SEND
  timestamp: Date
  requestId?: string
  data: {
    chatId: string
    content: string
    type: MessageType
    replyToId?: string
  }
}

export const sendMessageEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_SEND),
  requestId: z.string().uuid(),
  data: z.object({
    chatId: z.string().uuid(),
    content: z.string().min(1).max(5000),
    type: z.nativeEnum(MessageType),
    replyToId: z.string().uuid().optional(),
  }),
})
```

### Servidor → Cliente (Receive)

```typescript
export interface MessageReceivedEvent {
  event: WebSocketEventType.MESSAGE_RECEIVED
  timestamp: Date
  data: {
    messageId: string
    chatId: string
    senderId: string
    senderName: string
    senderAvatar: string | null
    content: string
    type: MessageType
    createdAt: Date
  }
}

export const messageReceivedEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_RECEIVED),
  data: z.object({
    messageId: z.string().uuid(),
    chatId: z.string().uuid(),
    senderId: z.string().uuid(),
    senderName: z.string(),
    senderAvatar: z.string().url().nullable(),
    content: z.string(),
    type: z.nativeEnum(MessageType),
    createdAt: z.coerce.date(),
  }),
})
```

### Eventos de Erro

```typescript
export enum WebSocketErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  CHAT_NOT_FOUND = 'CHAT_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export const errorEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.ERROR),
  data: z.object({
    code: z.nativeEnum(WebSocketErrorCode),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    requestId: z.string().uuid().optional(),
  }),
})
```

## 📋 Checklist para Novos Eventos

### Evento Cliente → Servidor

- [ ] Definir interface em types.ts
- [ ] Criar enum entry se necessário
- [ ] Criar schema com validações
- [ ] Usar `z.literal()` para o tipo de evento
- [ ] Validar todos os campos de input
- [ ] Adicionar ao discriminated union
- [ ] Documentar no README

### Evento Servidor → Cliente

- [ ] Definir interface em types.ts
- [ ] Criar enum entry se necessário
- [ ] Criar schema (sem validações pesadas)
- [ ] Incluir informações contextuais (userName, etc)
- [ ] Adicionar timestamps
- [ ] Adicionar ao discriminated union
- [ ] Documentar quando é emitido

### Evento WebRTC

- [ ] Seguir padrão offer/answer/candidate
- [ ] Sempre incluir `callId`
- [ ] Incluir `targetUserId` para rotas 1-to-1
- [ ] Validar estrutura SDP
- [ ] Validar estrutura ICE candidate
- [ ] Testar compatibilidade com WebRTC

## 🔍 Validações Específicas

### WebSocket

```typescript
// Chat IDs
z.string().uuid()

// Request IDs (para rastreamento)
z.string().uuid().optional()

// Timestamps (sempre coerce)
z.coerce.date()

// Eventos (sempre enum ou literal)
z.nativeEnum(WebSocketEventType)
z.literal(WebSocketEventType.MESSAGE_RECEIVED)

// Conteúdo de mensagem
z.string().min(1).max(5000)
```

### WebRTC

```typescript
// SDP (Session Description Protocol)
z.object({
  type: z.enum(['offer', 'answer']),
  sdp: z.string(), // Não validar conteúdo, apenas presença
})

// ICE Candidate
z.object({
  candidate: z.string(),
  sdpMid: z.string().nullable(),
  sdpMLineIndex: z.number().nullable(),
})

// Call ID
z.string().uuid()

// User IDs em chamadas
z.string().uuid()
z.array(z.string().uuid()).min(1)
```

## 🎯 Boas Práticas

### 1. Sempre use Discriminated Unions

```typescript
// ✅ CERTO
export const webSocketEventSchema = z.discriminatedUnion('event', [
  messageReceivedEventSchema,
  userTypingEventSchema,
])

// ❌ ERRADO
export const webSocketEventSchema = z.union([messageReceivedEventSchema, userTypingEventSchema])
```

### 2. Base Schema Reutilizável

```typescript
// ✅ CERTO - Define uma vez, reutiliza sempre
const baseEventSchema = z.object({
  event: z.nativeEnum(WebSocketEventType),
  timestamp: z.coerce.date(),
  requestId: z.string().uuid().optional(),
})

export const joinChatEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.JOIN_CHAT),
  data: z.object({ chatId: z.string().uuid() }),
})
```

### 3. Request IDs para Rastreamento

```typescript
// Cliente envia com requestId
{
  event: 'MESSAGE_SEND',
  requestId: 'abc-123',
  data: { ... }
}

// Servidor responde com mesmo requestId
{
  event: 'MESSAGE_RECEIVED',
  requestId: 'abc-123', // ← Mesmo ID!
  data: { messageId: 'def-456', ... }
}
```

### 4. Informações Contextuais

```typescript
// ✅ CERTO - Inclui contexto útil
export interface MessageReceivedEvent {
  event: WebSocketEventType.MESSAGE_RECEIVED
  data: {
    messageId: string
    senderId: string
    senderName: string // ← Cliente não precisa buscar
    senderAvatar: string // ← Pronto para exibir
    content: string
  }
}

// ❌ ERRADO - Cliente precisa fazer requests extras
export interface MessageReceivedEvent {
  data: {
    messageId: string
    senderId: string // ← Cliente precisa buscar dados do user
    content: string
  }
}
```

### 5. Eventos Bidirecionais

```typescript
// Cliente → Servidor: JOIN_CHAT
// Servidor → Cliente: CONNECTION_ACK ou ERROR

// Cliente → Servidor: MESSAGE_SEND
// Servidor → Cliente: MESSAGE_RECEIVED ou ERROR

// Cliente → Servidor: WEBRTC_OFFER
// Servidor → Outro Cliente: WEBRTC_OFFER_RECEIVED
```

## 📚 Exemplos Completos

### Chat Message Flow

```typescript
// 1. Cliente envia mensagem
const sendEvent: SendMessageEvent = {
  event: WebSocketEventType.MESSAGE_SEND,
  timestamp: new Date(),
  requestId: crypto.randomUUID(),
  data: {
    chatId: 'chat-123',
    content: 'Hello!',
    type: MessageType.TEXT,
  },
}

// 2. Servidor valida e salva

// 3. Servidor notifica todos no chat
const receivedEvent: MessageReceivedEvent = {
  event: WebSocketEventType.MESSAGE_RECEIVED,
  timestamp: new Date(),
  data: {
    messageId: 'msg-456',
    chatId: 'chat-123',
    senderId: 'user-789',
    senderName: 'João',
    senderAvatar: 'https://...',
    content: 'Hello!',
    type: MessageType.TEXT,
    createdAt: new Date(),
  },
}
```

### WebRTC Call Flow

```typescript
// 1. Iniciar chamada
const initiateEvent: CallInitiateEvent = {
  event: CallWebSocketEventType.CALL_INITIATE,
  timestamp: new Date(),
  data: {
    participantIds: ['user-1', 'user-2'],
    type: CallType.VIDEO,
  },
}

// 2. Servidor notifica participantes
const incomingEvent: CallIncomingEvent = {
  event: CallWebSocketEventType.CALL_INCOMING,
  timestamp: new Date(),
  data: {
    callId: 'call-123',
    type: CallType.VIDEO,
    initiatorId: 'user-0',
    initiatorName: 'João',
    participants: [...],
  },
}

// 3. Participante aceita
const answerEvent: CallAnswerEvent = {
  event: CallWebSocketEventType.CALL_ANSWER,
  timestamp: new Date(),
  data: {
    callId: 'call-123',
  },
}

// 4. WebRTC Offer
const offerEvent: WebRTCOfferEvent = {
  event: CallWebSocketEventType.WEBRTC_OFFER,
  timestamp: new Date(),
  data: {
    callId: 'call-123',
    targetUserId: 'user-1',
    offer: {
      type: 'offer',
      sdp: 'v=0\r\no=- ...',
    },
  },
}

// 5. WebRTC Answer
const answerEvent: WebRTCAnswerEvent = {
  event: CallWebSocketEventType.WEBRTC_ANSWER,
  timestamp: new Date(),
  data: {
    callId: 'call-123',
    targetUserId: 'user-0',
    answer: {
      type: 'answer',
      sdp: 'v=0\r\no=- ...',
    },
  },
}

// 6. ICE Candidates (múltiplos)
const iceEvent: WebRTCIceCandidateEvent = {
  event: CallWebSocketEventType.WEBRTC_ICE_CANDIDATE,
  timestamp: new Date(),
  data: {
    callId: 'call-123',
    targetUserId: 'user-1',
    candidate: {
      candidate: 'candidate:1 ...',
      sdpMid: '0',
      sdpMLineIndex: 0,
    },
  },
}
```

## ⚠️ Erros Comuns

### ❌ Union sem Discriminator

```typescript
// ERRADO - Zod não consegue diferenciar
const eventSchema = z.union([messageSchema, typingSchema])

// CERTO
const eventSchema = z.discriminatedUnion('event', [messageSchema, typingSchema])
```

### ❌ Validar SDP Content

```typescript
// ERRADO - SDP é complexo demais
z.string().regex(/^v=0\r\n.../)

// CERTO - Apenas validar presença
z.string()
```

### ❌ Não incluir Timestamps

```typescript
// ERRADO
export interface Event {
  event: string
  data: object
}

// CERTO
export interface Event {
  event: string
  timestamp: Date // ← Sempre!
  data: object
}
```

---

**Lembre-se:** WebSocket e WebRTC são comunicações em tempo real. Mantenha os eventos leves e eficientes!
