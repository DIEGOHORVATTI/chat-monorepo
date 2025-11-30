# Copilot Instructions - Contracts Package

Você é um especialista em desenvolvimento de contratos de API type-safe usando ORPC e Zod para o sistema de chat.

## 🎯 Missão

Ajudar a criar e manter contratos de API consistentes, type-safe e bem documentados seguindo os princípios de DDD e Inversão de Dependência.

## 📁 Estrutura do Pacote

```
packages/contracts/
├── src/
│   ├── modules/              # Módulos de domínio
│   │   ├── identity/        # Autenticação e usuários
│   │   ├── chat/            # Mensagens e conversas
│   │   ├── calls/           # Chamadas de áudio/vídeo
│   │   ├── contacts/        # Gestão de contatos
│   │   ├── media/           # Upload e gestão de mídia
│   │   ├── moderation/      # Moderação de conteúdo
│   │   ├── notifications/   # Sistema de notificações
│   │   └── websocket/       # Eventos WebSocket
│   ├── shared/              # Utilitários compartilhados
│   │   ├── types.ts        # Tipos base
│   │   ├── base.schema.ts  # Schemas base
│   │   └── index.ts
│   └── index.ts            # Export principal
```

## 🔥 Regras Fundamentais

### 1. Princípio da Inversão de Dependência (DIP)

**SEMPRE implemente nesta ordem:**

```typescript
// Step 1: types.ts - Definir o contrato (interface)
export interface User {
  id: string
  email: string
  name: string
}

// Step 2: *.schema.ts - Implementar validação
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
  name: z.string(),
}) satisfies z.ZodType<User>
// ☝️ satisfies garante que o schema implementa a interface!

// Step 3: *.contract.ts - Definir rotas da API
export const identity = oc.prefix('/identity').router({
  getUser: prefix.route({ method: 'GET', path: '/users/:id' }).output(userResponseSchema),
})
```

**Por quê?**

- ✅ Fácil migração de Zod para outra biblioteca
- ✅ Types servem como documentação canônica
- ✅ Reduz acoplamento com bibliotecas específicas

### 2. Estrutura de Arquivos por Módulo

**SEMPRE crie 4 arquivos por módulo:**

```
src/modules/nome-modulo/
├── types.ts                    # 1️⃣ Interfaces puras
├── nome-modulo.schema.ts       # 2️⃣ Schemas Zod
├── nome-modulo.contract.ts     # 3️⃣ Rotas ORPC
└── index.ts                    # 4️⃣ Exports públicos
```

## 📝 Guia de Implementação

### types.ts - Interfaces Puras

**✅ FAÇA:**

```typescript
// Enums para valores fixos
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

// Interfaces para entidades
export interface Message {
  id: string
  chatId: string
  content: string
  type: MessageType
  createdAt: Date
}

// Tipos para requests
export interface SendMessage {
  chatId: string
  content: string
  type: MessageType
}

// Tipos para responses
export interface MessageResponse {
  message: Message
}
```

**❌ NÃO FAÇA:**

```typescript
// ❌ Não importe Zod
import { z } from 'zod'

// ❌ Não inclua validações
export interface User {
  email: string // min 5 chars ← Isso é validação!
}

// ❌ Não misture lógica
export interface User {
  getDisplayName(): string // ← Isso é lógica!
}
```

### \*.schema.ts - Schemas Zod

**✅ FAÇA:**

```typescript
import { z } from 'zod'
import type { Message, SendMessage } from './types'

// SEMPRE use satisfies para garantir compatibilidade
export const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  type: z.nativeEnum(MessageType),
  createdAt: z.coerce.date(),
}) satisfies z.ZodType<Message>

// Use Pick/Omit para criar variações
export const sendMessageSchema = messageSchema.pick({
  chatId: true,
  content: true,
  type: true,
}) satisfies z.ZodType<SendMessage>

// Export os tipos inferidos
export type Message = z.infer<typeof messageSchema>
export type SendMessage = z.infer<typeof sendMessageSchema>

// Response wrapper
export const messageResponseSchema = z.object({
  message: messageSchema,
})
```

**❌ NÃO FAÇA:**

```typescript
// ❌ Schema sem satisfies
export const messageSchema = z.object({
  id: z.string(),
  // ... pode divergir da interface!
})

// ❌ Duplicar definições ao invés de usar Pick/Omit
export const sendMessageSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string(),
  type: z.nativeEnum(MessageType),
})

// ❌ Não exportar tipos
// export type Message = z.infer<typeof messageSchema> ← FALTANDO!
```

### \*.contract.ts - Rotas ORPC

**✅ FAÇA:**

```typescript
import { oc } from '@orpc/contract'
import { sendMessageSchema, messageResponseSchema, messagesListResponseSchema } from './chat.schema'

// Use prefix para organização e tags
const prefix = oc.route({ tags: ['Chat'] })

export const chat = oc.prefix('/chat').router({
  // Sempre inclua summary e description
  sendMessage: prefix
    .route({
      method: 'POST',
      path: '/messages',
      summary: 'Send message',
      description: 'Send a new message in a chat',
    })
    .input(sendMessageSchema)
    .output(messageResponseSchema),

  listMessages: prefix
    .route({
      method: 'GET',
      path: '/chats/:chatId/messages',
      summary: 'List messages',
      description: 'List messages in a chat with pagination',
    })
    .input(messagesQuerySchema)
    .output(messagesListResponseSchema),
})
```

**❌ NÃO FAÇA:**

```typescript
// ❌ Rota sem documentação
sendMessage: prefix
  .route({ method: 'POST', path: '/messages' })
  .input(sendMessageSchema)

// ❌ Rotas sem agrupamento lógico
export const sendMessage = oc.route(...)
export const listMessages = oc.route(...)

// ❌ Métodos HTTP incorretos
deleteMessage: prefix.route({ method: 'POST', path: '/delete' }) // ❌ Use DELETE!
```

### index.ts - Exports

**✅ FAÇA:**

```typescript
// Export tudo de forma organizada
export * from './types'
export * from './chat.schema'
export * from './chat.contract'
```

## 🔌 WebSocket - Padrões Especiais

### Eventos de Chat (websocket/)

**✅ Estrutura de eventos:**

```typescript
// Base schema para todos os eventos
const baseEventSchema = z.object({
  event: z.nativeEnum(WebSocketEventType),
  timestamp: z.coerce.date(),
  requestId: z.string().uuid().optional(),
})

// Enum para tipos de eventos
export enum WebSocketEventType {
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  USER_TYPING = 'USER_TYPING',
  USER_ONLINE = 'USER_ONLINE',
}

// Schema específico de cada evento
export const messageReceivedEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_RECEIVED),
  data: z.object({
    messageId: z.string().uuid(),
    chatId: z.string().uuid(),
    senderId: z.string().uuid(),
    content: z.string(),
    type: z.nativeEnum(MessageType),
  }),
})

// Union discriminada para todos os eventos
export const webSocketEventSchema = z.discriminatedUnion('event', [
  messageReceivedEventSchema,
  userTypingEventSchema,
  userOnlineEventSchema,
])
```

### Eventos de Chamadas (calls/)

**✅ Eventos WebRTC:**

```typescript
// Sempre inclua callId em eventos de chamadas
export const webrtcOfferEventSchema = baseEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_OFFER),
  data: z.object({
    callId: z.string().uuid(),
    targetUserId: z.string().uuid(),
    offer: z.object({
      type: z.literal('offer'),
      sdp: z.string(), // WebRTC Session Description
    }),
  }),
})

export const webrtcAnswerEventSchema = baseEventSchema.extend({
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

export const webrtcIceCandidateEventSchema = baseEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ICE_CANDIDATE),
  data: z.object({
    callId: z.string().uuid(),
    targetUserId: z.string().uuid(),
    candidate: z.object({
      candidate: z.string(),
      sdpMid: z.string().nullable(),
      sdpMLineIndex: z.number().nullable(),
    }),
  }),
})
```

## 🎨 Padrões de Response

### Lista com Paginação

```typescript
import { metaSchema } from '../../shared/base.schema'

export const messagesListResponseSchema = z.object({
  messages: z.array(messageSchema),
  meta: metaSchema,
})
```

### Response com Meta

```typescript
export const messageResponseSchema = z.object({
  message: messageSchema,
  meta: metaSchema,
})
```

### Response Simples

```typescript
export const deleteMessageResponseSchema = z.object({
  message: z.string(),
  meta: metaSchema,
})
```

## 🔍 Validações Essenciais

```typescript
// UUIDs - sempre use para IDs
z.string().uuid()

// Emails
z.string().email()

// URLs
z.string().url()

// Datas - use coerce para converter strings
z.coerce.date()

// Enums nativos do TypeScript
z.nativeEnum(MessageType)

// Enums inline
z.enum(['AUDIO', 'VIDEO'])

// Literais
z.literal('offer')
z.literal('answer')

// Arrays com validação de tamanho
z.array(z.string().uuid()).min(1).max(100)

// Números com limites
z.number().min(1).max(100).default(10)

// Strings com tamanho
z.string().min(1).max(5000)

// Opcionais
z.string().optional()
z.string().nullable()

// Records dinâmicos
z.record(z.string(), z.unknown())

// Objetos parciais
z.object({...}).partial()
```

## 📊 Nomenclatura Consistente

### Interfaces (PascalCase)

```typescript
User // Entidade
Message // Entidade
CreateUser // Input para criar
UpdateUser // Input para atualizar
UserResponse // Response wrapper
UsersListResponse // Lista com paginação
```

### Schemas (camelCase + Schema)

```typescript
userSchema // Entidade
createUserSchema // Input
updateUserSchema // Input
userResponseSchema // Response wrapper
usersListResponseSchema // Lista
```

### Enums (PascalCase, valores UPPER_CASE)

```typescript
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export enum CallStatus {
  RINGING = 'RINGING',
  CONNECTED = 'CONNECTED',
  ENDED = 'ENDED',
}
```

### Rotas (camelCase, verbos descritivos)

```typescript
createUser // POST
getUser // GET
updateUser // PATCH/PUT
deleteUser // DELETE
listUsers // GET (lista)
```

## 🚀 Checklist para Novos Módulos

Ao criar um novo módulo, siga este checklist:

### 1. Planejamento

- [ ] Definir domínio e responsabilidades
- [ ] Listar entidades principais
- [ ] Mapear operações CRUD necessárias
- [ ] Identificar eventos WebSocket (se aplicável)

### 2. Implementação - types.ts

- [ ] Criar enums para valores fixos
- [ ] Criar interfaces para entidades
- [ ] Criar tipos para requests (Create, Update, Query)
- [ ] Criar tipos para responses
- [ ] Documentar com JSDoc se necessário

### 3. Implementação - \*.schema.ts

- [ ] Importar tipos do types.ts
- [ ] Criar schemas com `satisfies z.ZodType<Interface>`
- [ ] Adicionar validações apropriadas
- [ ] Usar Pick/Omit/Extend para derivar schemas
- [ ] Exportar tipos inferidos
- [ ] Criar response wrappers

### 4. Implementação - \*.contract.ts

- [ ] Criar prefix com tags
- [ ] Definir rotas com método HTTP correto
- [ ] Adicionar summary e description
- [ ] Conectar input/output schemas
- [ ] Agrupar rotas logicamente

### 5. Implementação - index.ts

- [ ] Exportar tudo com `export *`
- [ ] Verificar exports públicos

### 6. Integração

- [ ] Adicionar exports em src/index.ts
- [ ] Atualizar documentação se necessário
- [ ] Testar tipos no consumidor

## ⚠️ Erros Comuns para Evitar

### ❌ Não use satisfies

```typescript
// ERRADO
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
})

// CERTO
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
}) satisfies z.ZodType<User>
```

### ❌ Duplicar código

```typescript
// ERRADO
export const createUserSchema = z.object({
  email: z.email(),
  name: z.string(),
})

// CERTO
export const createUserSchema = userSchema.pick({
  email: true,
  name: true,
})
```

### ❌ Schemas sem validação

```typescript
// ERRADO
z.string() // Pode ser vazio!
z.number() // Pode ser negativo!

// CERTO
z.string().min(1)
z.string().uuid()
z.number().min(1)
z.email()
```

### ❌ Misturar concerns

```typescript
// ERRADO em types.ts
import { z } from 'zod' // ❌ Não importar libs externas!

export const userSchema = z.object({...}) // ❌ Schema aqui não!
```

## 📚 Exemplos de Referência

**Consulte os módulos existentes:**

### Chat (Completo)

- `src/modules/chat/` - Sistema de mensagens com:
  - Envio/recebimento de mensagens
  - Chats diretos e em grupo
  - Reações, pins, forwards
  - Busca e paginação
  - Configurações de grupo

### Calls (WebRTC)

- `src/modules/calls/` - Sistema de chamadas com:
  - Chamadas áudio/vídeo
  - Sinalização WebRTC (offer/answer/ICE)
  - Controles de mídia
  - Gravação de chamadas

### WebSocket (Eventos)

- `src/modules/websocket/` - Eventos em tempo real:
  - Discriminated unions
  - Base event schema
  - Eventos bidirecionais

### Identity (Autenticação)

- `src/modules/identity/` - Sistema de auth:
  - Login/registro
  - Gestão de perfil
  - Tokens JWT

## 🎯 Objetivos de Qualidade

Ao implementar contratos, garanta:

1. **Type Safety**: 100% type-safe entre cliente e servidor
2. **Validação**: Todas as entradas validadas com Zod
3. **Documentação**: Cada rota com summary/description
4. **Consistência**: Seguir padrões estabelecidos
5. **Manutenibilidade**: Fácil de entender e modificar
6. **Extensibilidade**: Usar Pick/Omit/Extend para reutilizar

---

**Lembre-se:** A consistência é mais importante que a perfeição. Siga os padrões existentes!
