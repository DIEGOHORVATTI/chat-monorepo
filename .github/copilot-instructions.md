# GitHub Copilot Instructions - Chat Monorepo

Você é um assistente especializado no desenvolvimento do sistema de comunicação com suporte a mensagens em tempo real, chamadas de áudio/vídeo e WebSocket.

## 🎯 Contexto do Projeto

Este é um monorepo TypeScript que implementa um sistema de chat completo com:

- Mensagens em tempo real via WebSocket
- Chamadas de áudio/vídeo com WebRTC
- Arquitetura baseada em contratos com ORPC
- Validação type-safe com Zod
- Domain-Driven Design (DDD)

## 📐 Arquitetura e Princípios

### Inversão de Dependência (DIP)

**SEMPRE siga esta estrutura ao criar novos módulos:**

```typescript
// 1. types.ts - Interfaces puras (sem dependências de bibliotecas)
export interface User {
  id: string
  email: string
  name: string
}

// 2. *.schema.ts - Implementação Zod usando 'satisfies'
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
  name: z.string().min(1),
}) satisfies z.ZodType<User>

// 3. *.contract.ts - Rotas ORPC
export const identity = oc.prefix('/identity').router({
  getUser: prefix.route({ method: 'GET', path: '/users/:id' }).output(userResponseSchema),
})
```

### Estrutura de Módulos

```
src/modules/
  └── nome-modulo/
      ├── types.ts              # Interfaces TypeScript puras
      ├── nome-modulo.schema.ts # Schemas Zod com 'satisfies'
      ├── nome-modulo.contract.ts # Contratos ORPC
      └── index.ts              # Exports públicos
```

## 🔧 Regras de Implementação

### 1. Tipos (types.ts)

- ✅ Apenas interfaces e types TypeScript puros
- ✅ Sem imports de bibliotecas externas (Zod, ORPC, etc)
- ✅ Use enums para valores fixos
- ✅ Nomes em PascalCase para interfaces e enums
- ❌ Nunca inclua lógica ou validações aqui

**Exemplo:**

```typescript
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  type: MessageType
  createdAt: Date
}
```

### 2. Schemas (\*.schema.ts)

- ✅ Use Zod para todas as validações
- ✅ SEMPRE use `satisfies z.ZodType<Interface>` para garantir compatibilidade
- ✅ Export os tipos inferidos: `export type User = z.infer<typeof userSchema>`
- ✅ Use `.pick()`, `.omit()`, `.extend()` para criar variações
- ✅ Adicione validações específicas (email, uuid, min, max, etc)
- ✅ Use discriminated unions para eventos WebSocket

**Exemplo:**

```typescript
import { z } from 'zod'
import type { User, CreateUser } from './types'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
  name: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
}) satisfies z.ZodType<User>

export const createUserSchema = userSchema.pick({
  email: true,
  name: true,
}) satisfies z.ZodType<CreateUser>

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
```

### 3. Contratos (\*.contract.ts)

- ✅ Use ORPC para definir rotas
- ✅ Agrupe rotas relacionadas com `oc.prefix()`
- ✅ Adicione tags para documentação
- ✅ Inclua `summary` e `description` em cada rota
- ✅ Use `.input()` e `.output()` para definir schemas
- ✅ Siga REST conventions (GET, POST, PATCH, DELETE)

**Exemplo:**

```typescript
import { oc } from '@orpc/contract'
import { createUserSchema, userResponseSchema } from './user.schema'

const prefix = oc.route({ tags: ['Users'] })

export const users = oc.prefix('/users').router({
  create: prefix
    .route({
      method: 'POST',
      path: '/users',
      summary: 'Create user',
      description: 'Create a new user account',
    })
    .input(createUserSchema)
    .output(userResponseSchema),

  getById: prefix
    .route({
      method: 'GET',
      path: '/users/:id',
      summary: 'Get user by ID',
      description: 'Retrieve user details by ID',
    })
    .output(userResponseSchema),
})
```

### 4. Schemas Compartilhados (shared/)

Use schemas base para padrões comuns:

```typescript
// Sempre inclua meta em respostas de lista
export interface ListResponse<T> {
  data: T[]
  meta: Meta
}

// Meta para paginação
export interface Meta {
  total: number
  page: number
  limit: number
  pages: number
}
```

## 🔌 WebSocket Guidelines

### Eventos de Chat

- Use `discriminatedUnion` para eventos WebSocket
- Sempre inclua `event`, `timestamp`, e `data`
- Use enums para tipos de eventos
- Documente cada evento claramente

**Exemplo:**

```typescript
export enum WebSocketEventType {
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  USER_TYPING = 'USER_TYPING',
  USER_ONLINE = 'USER_ONLINE',
}

const baseEventSchema = z.object({
  event: z.nativeEnum(WebSocketEventType),
  timestamp: z.coerce.date(),
  requestId: z.string().uuid().optional(),
})

export const messageReceivedEventSchema = baseEventSchema.extend({
  event: z.literal(WebSocketEventType.MESSAGE_RECEIVED),
  data: z.object({
    messageId: z.string().uuid(),
    chatId: z.string().uuid(),
    content: z.string(),
  }),
})
```

### Eventos de Chamadas (WebRTC)

- Sempre inclua `callId` em eventos de chamadas
- Use eventos separados para offer/answer/candidate
- Mantenha compatibilidade com WebRTC SDP

**Exemplo:**

```typescript
export const webrtcOfferEventSchema = baseEventSchema.extend({
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
```

## 📝 Convenções de Nomenclatura

### Interfaces e Types

- **PascalCase**: `User`, `Message`, `CreateChat`
- **Sufixos descritivos**: `CreateUser`, `UpdateUser`, `UserResponse`

### Schemas Zod

- **camelCase + Schema**: `userSchema`, `createUserSchema`
- **Response schemas**: `userResponseSchema`, `usersListResponseSchema`

### Enums

- **PascalCase**: `MessageType`, `ChatType`, `CallStatus`
- **Valores em UPPER_CASE**: `TEXT`, `IMAGE`, `CONNECTED`

### Rotas ORPC

- **camelCase**: `createChat`, `sendMessage`, `listUsers`
- **Verbos descritivos**: `create`, `update`, `delete`, `list`, `get`

## 🚀 Ao Adicionar Novos Módulos

**Checklist obrigatório:**

1. **Criar estrutura**:

   ```
   src/modules/new-module/
   ├── types.ts
   ├── new-module.schema.ts
   ├── new-module.contract.ts
   └── index.ts
   ```

2. **types.ts**:

   - [ ] Interfaces puras sem dependências
   - [ ] Enums para valores fixos
   - [ ] Tipos de request/response separados

3. **\*.schema.ts**:

   - [ ] Todos os schemas com `satisfies z.ZodType<Interface>`
   - [ ] Validações apropriadas (email, uuid, min, max)
   - [ ] Exports de tipos inferidos

4. **\*.contract.ts**:

   - [ ] Rotas com método HTTP correto
   - [ ] Summary e description em cada rota
   - [ ] Input/output schemas definidos
   - [ ] Agrupamento lógico com prefix

5. **index.ts**:

   ```typescript
   export * from './types'
   export * from './new-module.schema'
   export * from './new-module.contract'
   ```

6. **Atualizar src/index.ts**:
   ```typescript
   export * from './modules/new-module'
   ```

## 🎨 Padrões de Código

### Use discriminated unions para tipos variados

```typescript
export type WebSocketEvent = MessageReceivedEvent | UserTypingEvent | UserOnlineEvent
```

### Use Pick/Omit para derivar tipos

```typescript
export const loginSchema = userSchema.pick({
  email: true,
  password: true,
})

export const userResponseSchema = z.object({
  user: userSchema.omit({ password: true }),
})
```

### Response wrapper pattern

```typescript
export const messageResponseSchema = z.object({
  message: messageSchema,
  meta: metaSchema,
})
```

## 🔍 Validações Comuns

```typescript
// UUIDs
z.string().uuid()

// Emails
z.email()

// Datas
z.coerce.date()

// Enums
z.nativeEnum(MessageType)
z.enum(['TEXT', 'IMAGE', 'VIDEO'])

// Opcional com default
z.number().min(1).default(1)

// Arrays
z.array(z.string().uuid()).min(1)

// Records/Objects dinâmicos
z.record(z.string(), z.unknown())
```

## ⚠️ Evite

- ❌ Misturar lógica de validação em types.ts
- ❌ Usar `any` ou `unknown` sem necessidade
- ❌ Criar schemas sem usar `satisfies`
- ❌ Importar Zod em types.ts
- ❌ Rotas sem documentação (summary/description)
- ❌ Schemas sem validações apropriadas
- ❌ Copiar código - use Pick/Omit/Extend

## 📚 Referências

- [ORPC Documentation](https://orpc.dev/)
- [Zod Documentation](https://zod.dev/)
- [WebSocket Events](./packages/contracts/docs/WebSocket.md)
- [Calls Documentation](./packages/contracts/docs/CALLS.md)
- [Architecture](./packages/contracts/ARCHITECTURE.md)

## 💡 Exemplos Completos

Consulte os módulos existentes para referência:

- `packages/contracts/src/modules/chat/` - Sistema de mensagens completo
- `packages/contracts/src/modules/calls/` - Sistema de chamadas WebRTC
- `packages/contracts/src/modules/identity/` - Autenticação e usuários
- `packages/contracts/src/modules/websocket/` - Eventos WebSocket

---

**Lembre-se:** Mantenha a consistência com o código existente. Em caso de dúvida, consulte os módulos implementados.
