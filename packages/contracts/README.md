# Chat Monorepo - Contratos (API Contracts)

Definições de contratos de API usando ORPC e Zod para o sistema de chat completo com suporte a mensagens em tempo real, chamadas de áudio e vídeo.

## 📦 Estrutura

```
packages/contracts/
├── src/
│   ├── schemas/          # Schemas Zod
│   │   ├── base.ts              # Schemas base (paginação, meta)
│   │   ├── identity.ts          # Usuários e autenticação
│   │   ├── chat.ts              # Mensagens e chats
│   │   ├── calls.ts             # Chamadas de áudio/vídeo
│   │   ├── websocket.ts         # Eventos WebSocket (chat)
│   │   ├── websocket-calls.ts   # Eventos WebSocket (chamadas)
│   │   └── index.ts
│   └── routes/           # Rotas ORPC
│       ├── identity.ts          # Rotas de autenticação
│       ├── chat.ts              # Rotas de chat
│       ├── calls.ts             # Rotas de chamadas
│       ├── websocket.ts         # Rotas WebSocket
│       └── index.ts
├── WEBSOCKET.md         # Documentação WebSocket (chat)
├── CALLS.md            # Documentação de chamadas
└── README.md           # Este arquivo
```

## 🚀 Domínios da Aplicação

### 1. **Identity (Autenticação e Usuários)**

Gerenciamento de usuários, autenticação, perfis e privacidade.

#### Rotas REST:
- `POST /identity/login` - Login
- `POST /identity/register` - Registro
- `POST /identity/verify-email` - Verificar email
- `POST /identity/resend-verification` - Reenviar código
- `GET /identity/logout` - Logout
- `GET /identity/me` - Usuário atual
- `GET /identity/users` - Listar usuários
- `POST /identity/users` - Criar usuário
- `PATCH /identity/me/privacy` - Atualizar privacidade
- `PATCH /identity/me/profile` - Atualizar perfil
- `PATCH /identity/me/change-password` - Trocar senha
- `POST /identity/me/block/:userId` - Bloquear usuário
- `DELETE /identity/me/block/:userId` - Desbloquear usuário

#### Schemas:
- `User`, `Login`, `Register`, `UserResponse`
- Configurações de privacidade
- Permissões de usuário

---

### 2. **Chat (Mensagens e Conversas)**

Sistema completo de chat com suporte a mensagens de texto, imagens, arquivos, etc.

#### Rotas REST:
- `POST /chat/chats` - Criar chat
- `GET /chat/chats` - Listar chats
- `GET /chat/chats/:chatId` - Obter chat
- `PATCH /chat/chats/:chatId` - Atualizar chat
- `DELETE /chat/chats/:chatId` - Deletar chat
- `POST /chat/chats/:chatId/participants` - Adicionar participantes
- `DELETE /chat/chats/:chatId/participants/:id` - Remover participante
- `POST /chat/chats/:chatId/leave` - Sair do chat
- `POST /chat/messages` - Enviar mensagem
- `GET /chat/chats/:chatId/messages` - Listar mensagens
- `GET /chat/messages/:messageId` - Obter mensagem
- `PATCH /chat/messages/:messageId` - Editar mensagem
- `DELETE /chat/messages/:messageId` - Deletar mensagem
- `POST /chat/messages/:messageId/read` - Marcar como lida
- `POST /chat/chats/:chatId/typing` - Indicador de digitação

#### Tipos de Mensagem:
- `TEXT`, `IMAGE`, `VIDEO`, `AUDIO`, `FILE`, `LOCATION`

#### Status de Mensagem:
- `SENT`, `DELIVERED`, `READ`, `FAILED`

#### Tipos de Chat:
- `DIRECT` (1-a-1)
- `GROUP` (múltiplos participantes)

#### WebSocket Events:
- `JOIN_CHAT`, `LEAVE_CHAT` - Gerenciar salas
- `TYPING_START`, `TYPING_STOP` - Indicadores de digitação
- `MESSAGE_SEND`, `MESSAGE_READ` - Mensagens
- `MESSAGE_RECEIVED`, `MESSAGE_UPDATED`, `MESSAGE_DELETED` - Atualizações
- `USER_ONLINE`, `USER_OFFLINE` - Presença
- `PARTICIPANT_JOINED`, `PARTICIPANT_LEFT` - Participantes

📖 [Documentação completa WebSocket](./WEBSOCKET.md)

---

### 3. **Calls (Chamadas de Áudio e Vídeo)**

Sistema completo de chamadas usando WebRTC para comunicação P2P.

#### Rotas REST:
- `POST /calls` - Iniciar chamada
- `POST /calls/:callId/answer` - Atender/recusar chamada
- `POST /calls/:callId/end` - Encerrar chamada
- `GET /calls/:callId` - Obter detalhes
- `GET /calls/active` - Chamadas ativas
- `GET /calls/history` - Histórico
- `POST /calls/:callId/participants` - Adicionar participantes
- `PATCH /calls/:callId/media` - Atualizar mídia
- `GET /calls/:callId/participants` - Listar participantes

#### Sinalização WebRTC (REST):
- `POST /calls/signaling/offer` - Enviar offer
- `POST /calls/signaling/answer` - Enviar answer
- `POST /calls/signaling/ice-candidate` - Enviar ICE candidate

#### Tipos de Chamada:
- `AUDIO` - Apenas áudio
- `VIDEO` - Vídeo + áudio

#### Status da Chamada:
- `RINGING`, `CONNECTING`, `CONNECTED`, `ENDED`
- `MISSED`, `DECLINED`, `FAILED`, `BUSY`

#### WebSocket Events:
- `CALL_INITIATE`, `CALL_ANSWER`, `CALL_DECLINE`, `CALL_END`
- `CALL_INCOMING`, `CALL_STARTED`, `CALL_ENDED`
- `CALL_PARTICIPANT_JOINED`, `CALL_PARTICIPANT_LEFT`
- `CALL_PARTICIPANT_MEDIA_UPDATE` - Controles de mídia
- `WEBRTC_OFFER`, `WEBRTC_ANSWER`, `WEBRTC_ICE_CANDIDATE` - Sinalização

#### Recursos:
- ✅ Chamadas 1-a-1 e em grupo
- ✅ Áudio e vídeo
- ✅ Controles (mute, video on/off)
- ✅ Compartilhamento de tela
- ✅ Sinalização WebRTC via WebSocket
- ✅ ICE candidates para NAT traversal

📖 [Documentação completa de Chamadas](./CALLS.md)

---

## 🔌 WebSocket

### Endpoint de Conexão
```
ws://your-domain/ws?token=YOUR_JWT_TOKEN
```

### Autenticação
- Query parameter: `?token=JWT_TOKEN`
- Authorization header: `Authorization: Bearer JWT_TOKEN`

### Eventos Disponíveis

#### Chat (20 eventos)
- **Cliente → Servidor** (7): JOIN_CHAT, LEAVE_CHAT, TYPING_START, TYPING_STOP, MESSAGE_SEND, MESSAGE_READ, PING
- **Servidor → Cliente** (13): CONNECTION_ACK, MESSAGE_RECEIVED, MESSAGE_UPDATED, MESSAGE_DELETED, MESSAGE_STATUS_CHANGED, USER_TYPING, USER_ONLINE, USER_OFFLINE, CHAT_UPDATED, PARTICIPANT_JOINED, PARTICIPANT_LEFT, ERROR, PONG

#### Chamadas (19 eventos)
- **Cliente → Servidor** (8): CALL_INITIATE, CALL_ANSWER, CALL_DECLINE, CALL_END, CALL_PARTICIPANT_MEDIA_UPDATE, WEBRTC_OFFER, WEBRTC_ANSWER, WEBRTC_ICE_CANDIDATE
- **Servidor → Cliente** (11): CALL_INCOMING, CALL_STARTED, CALL_ENDED, CALL_PARTICIPANT_JOINED, CALL_PARTICIPANT_LEFT, CALL_PARTICIPANT_MEDIA_CHANGED, CALL_STATUS_CHANGED, WEBRTC_OFFER_RECEIVED, WEBRTC_ANSWER_RECEIVED, WEBRTC_ICE_CANDIDATE_RECEIVED

---

## 📝 Uso

### Instalação

```bash
# No workspace root
pnpm install
```

### Importação

```typescript
// Schemas
import {
  // Identity
  User, Login, Register, UserResponse,
  
  // Chat
  Message, Chat, SendMessage, ChatMessageResponse,
  MessageType, MessageStatus, ChatType,
  
  // Calls
  Call, InitiateCall, CallResponse,
  CallType, CallStatus, ParticipantStatus,
  
  // WebSocket
  WebSocketEvent, WebSocketEventType,
  CallWebSocketEvent, CallWebSocketEventType,
} from '@packages/contracts'

// Rotas
import { identity, chat, calls, websocket } from '@packages/contracts'
```

### Exemplo de Uso

```typescript
// Validar dados com Zod
import { sendMessageSchema } from '@packages/contracts'

const data = {
  chatId: 'uuid',
  content: 'Hello!',
  type: 'TEXT'
}

const validated = sendMessageSchema.parse(data)

// Usar contratos ORPC
import { chat } from '@packages/contracts'

// O contrato define automaticamente tipos e validação
const response = await chat.sendMessage(validated)
```

---

## 🛠️ Tecnologias

- **[ORPC](https://orpc.io/)** - Framework para contratos de API type-safe
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **TypeScript** - Type safety end-to-end
- **WebSocket** - Comunicação bidirecional em tempo real
- **WebRTC** - Comunicação P2P para áudio/vídeo

---

## 📐 Arquitetura

```
┌─────────────────┐
│   Client App    │
│   (Frontend)    │
└────────┬────────┘
         │
         │ Import contracts
         ▼
┌─────────────────┐
│   @packages/    │
│   contracts     │◄────────┐
└────────┬────────┘         │
         │                  │
         │ Implement        │ Share types
         ▼                  │
┌─────────────────┐         │
│   Server API    │─────────┘
│   (Backend)     │
└─────────────────┘
```

**Benefícios:**
- ✅ Type-safety entre cliente e servidor
- ✅ Validação automática com Zod
- ✅ Documentação viva (tipos como docs)
- ✅ Refatoração segura
- ✅ Autocompletar no IDE
- ✅ Erros em tempo de compilação

---

## 🔍 Padrões de Código

### Schemas

```typescript
// Sempre use z.object() para schemas complexos
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
  name: z.string(),
})

// Use .pick() para criar schemas derivados
export const loginSchema = userSchema.pick({
  email: true,
  password: true,
})

// Use .omit() para excluir campos
export const userResponseSchema = z.object({
  user: userSchema.omit({ password: true }),
})

// Sempre exporte os tipos
export type User = z.infer<typeof userSchema>
```

### Rotas

```typescript
// Use prefixos para organizar rotas
const prefix = oc.route({ tags: ['Chat'] })

export const chat = oc.prefix('/chat').router({
  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/messages',
      summary: 'Send message',
      description: 'Send a new message in a chat',
    })
    .input(sendMessageSchema)
    .output(messageResponseSchema),
})
```

### WebSocket Events

```typescript
// Use discriminated unions para eventos
export const webSocketEventSchema = z.discriminatedUnion('event', [
  messageReceivedEventSchema,
  userTypingEventSchema,
  // ...
])

// Base event schema para consistência
const baseEventSchema = z.object({
  event: z.nativeEnum(EventType),
  timestamp: z.date(),
  requestId: z.string().uuid().optional(),
})
```

---

## 📚 Documentação Adicional

- [WebSocket - Chat em Tempo Real](./WEBSOCKET.md)
- [Chamadas de Áudio e Vídeo](./CALLS.md)

---

## 🤝 Contribuindo

1. Adicione novos schemas em `src/schemas/`
2. Crie rotas correspondentes em `src/routes/`
3. Exporte tudo pelos arquivos `index.ts`
4. Documente eventos WebSocket se aplicável
5. Mantenha os tipos exportados

---

## 📄 Licença

MIT
