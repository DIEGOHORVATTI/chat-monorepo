# 💬 Exemplos de Interação com os Agentes

Este arquivo contém exemplos reais de como interagir com os agentes de IA do GitHub Copilot.

## 🎯 Formato das Conversas

### ✅ Perguntas Efetivas

```
Desenvolvedor: "Crie um módulo de pagamentos com:
- Entidade Payment (id, userId, amount, currency, status, createdAt)
- Enum PaymentStatus (PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED)
- Rotas REST para criar pagamento e listar histórico
- Evento WebSocket PAYMENT_STATUS_CHANGED"

Agente: [Cria estrutura completa seguindo os padrões]
```

### ❌ Perguntas Vagas

```
Desenvolvedor: "Adicione pagamentos"

Agente: [Precisa de mais contexto]
```

---

## 📦 Exemplos - Agente de Contratos

### Exemplo 1: Criar Módulo Completo

**Prompt:**

```
Crie um módulo de grupos com as seguintes especificações:

Entidades:
- Group: id, name, description, avatarUrl, ownerId, createdAt, updatedAt
- GroupMember: groupId, userId, role (OWNER, ADMIN, MEMBER), joinedAt

Enums:
- GroupMemberRole: OWNER, ADMIN, MEMBER
- GroupPrivacy: PUBLIC, PRIVATE

Rotas REST:
- POST /groups - Criar grupo
- GET /groups - Listar meus grupos
- GET /groups/:id - Obter detalhes
- PATCH /groups/:id - Atualizar grupo
- DELETE /groups/:id - Deletar grupo
- POST /groups/:id/members - Adicionar membros
- DELETE /groups/:id/members/:userId - Remover membro
- PATCH /groups/:id/members/:userId/role - Atualizar role

Eventos WebSocket:
- GROUP_CREATED
- GROUP_UPDATED
- GROUP_DELETED
- MEMBER_JOINED
- MEMBER_LEFT
- MEMBER_ROLE_CHANGED

Siga todos os padrões do projeto incluindo:
- Inversão de Dependência (types → schema → contract)
- Schemas com satisfies
- Validações apropriadas
- Response wrappers com meta
- Discriminated unions para eventos
```

**Resultado Esperado:**

```
src/modules/groups/
├── types.ts
│   ├── enum GroupMemberRole
│   ├── enum GroupPrivacy
│   ├── enum GroupWebSocketEventType
│   ├── interface Group
│   ├── interface GroupMember
│   ├── interface CreateGroup
│   ├── interface UpdateGroup
│   └── ... outros tipos
│
├── groups.schema.ts
│   ├── groupSchema (satisfies z.ZodType<Group>)
│   ├── createGroupSchema
│   ├── groupResponseSchema
│   ├── groupsListResponseSchema
│   └── ... schemas de eventos WebSocket
│
├── groups.contract.ts
│   └── export const groups = oc.prefix('/groups').router({ ... })
│
└── index.ts
    └── export * from ...
```

---

### Exemplo 2: Adicionar Validações Específicas

**Prompt:**

```
No módulo de grupos, adicione validações específicas:

1. Nome do grupo:
   - Min 3 caracteres
   - Max 50 caracteres
   - Não pode começar ou terminar com espaço
   - Não pode conter apenas espaços

2. Descrição:
   - Max 500 caracteres
   - Opcional

3. Avatar URL:
   - Deve ser URL válida
   - Opcional

4. Membros:
   - Array de UUIDs
   - Min 1 membro (ao adicionar)
   - Max 100 membros (limite do grupo)

Adicione mensagens de erro customizadas para cada validação.
```

**Código Gerado:**

```typescript
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must be at most 50 characters')
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Group name cannot be only spaces',
    }),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional(),
  privacy: z.nativeEnum(GroupPrivacy),
}) satisfies z.ZodType<CreateGroup>

export const addMembersSchema = z.object({
  groupId: z.string().uuid(),
  memberIds: z
    .array(z.string().uuid('Each member ID must be a valid UUID'))
    .min(1, 'Must add at least one member')
    .max(100, 'Cannot add more than 100 members at once'),
}) satisfies z.ZodType<AddMembers>
```

---

### Exemplo 3: Refatorar Schema Existente

**Prompt:**

```
Refatore o módulo de chat para usar Pick/Omit ao invés de duplicar definições.

Atualmente temos:
- messageSchema (completo)
- sendMessageSchema (duplica campos)
- updateMessageSchema (duplica campos)

Transforme para usar .pick() e .omit() apropriadamente.
```

**Antes:**

```typescript
export const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  content: z.string().min(1),
  type: z.nativeEnum(MessageType),
  createdAt: z.coerce.date(),
})

export const sendMessageSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1),
  type: z.nativeEnum(MessageType),
})
```

**Depois:**

```typescript
export const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  type: z.nativeEnum(MessageType),
  createdAt: z.coerce.date(),
}) satisfies z.ZodType<Message>

export const sendMessageSchema = messageSchema.pick({
  chatId: true,
  content: true,
  type: true,
}) satisfies z.ZodType<SendMessage>

export const updateMessageSchema = messageSchema
  .pick({
    content: true,
  })
  .extend({
    messageId: z.string().uuid(),
  }) satisfies z.ZodType<UpdateMessage>
```

---

## 🔌 Exemplos - Agente WebSocket

### Exemplo 4: Criar Eventos de Presença

**Prompt:**

```
Crie um sistema completo de presença de usuário com os seguintes eventos:

Cliente → Servidor:
- SET_STATUS: usuário define status (online, away, busy, offline)
- SET_CUSTOM_MESSAGE: usuário define mensagem customizada

Servidor → Cliente:
- USER_STATUS_CHANGED: notifica quando outro usuário muda status
- USER_PRESENCE_UPDATE: atualização periódica de presença
- USERS_ONLINE_LIST: lista inicial de usuários online

Dados necessários:
- userId: UUID
- status: enum (ONLINE, AWAY, BUSY, OFFLINE)
- customMessage: string opcional (max 100 chars)
- lastSeen: timestamp
- isTyping: boolean (integrar com typing events)

Siga o padrão de discriminated unions e inclua todas as validações.
```

**Resultado Esperado:**

```typescript
// types.ts
export enum UserStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export enum PresenceEventType {
  SET_STATUS = 'SET_STATUS',
  SET_CUSTOM_MESSAGE = 'SET_CUSTOM_MESSAGE',
  USER_STATUS_CHANGED = 'USER_STATUS_CHANGED',
  USER_PRESENCE_UPDATE = 'USER_PRESENCE_UPDATE',
  USERS_ONLINE_LIST = 'USERS_ONLINE_LIST',
}

export interface SetStatusEvent extends BaseWebSocketEvent {
  event: PresenceEventType.SET_STATUS
  data: {
    status: UserStatus
  }
}

export interface UserStatusChangedEvent extends BaseWebSocketEvent {
  event: PresenceEventType.USER_STATUS_CHANGED
  data: {
    userId: string
    userName: string
    userAvatar: string | null
    status: UserStatus
    customMessage?: string
    lastSeen: Date
  }
}

// ... demais interfaces

// websocket.schema.ts
const basePresenceEventSchema = z.object({
  event: z.nativeEnum(PresenceEventType),
  timestamp: z.coerce.date(),
  requestId: z.string().uuid().optional(),
})

export const setStatusEventSchema = basePresenceEventSchema.extend({
  event: z.literal(PresenceEventType.SET_STATUS),
  data: z.object({
    status: z.nativeEnum(UserStatus),
  }),
})

export const setCustomMessageEventSchema = basePresenceEventSchema.extend({
  event: z.literal(PresenceEventType.SET_CUSTOM_MESSAGE),
  data: z.object({
    customMessage: z.string().max(100).optional(),
  }),
})

export const userStatusChangedEventSchema = basePresenceEventSchema.extend({
  event: z.literal(PresenceEventType.USER_STATUS_CHANGED),
  data: z.object({
    userId: z.string().uuid(),
    userName: z.string(),
    userAvatar: z.string().url().nullable(),
    status: z.nativeEnum(UserStatus),
    customMessage: z.string().max(100).optional(),
    lastSeen: z.coerce.date(),
  }),
})

// Discriminated union
export const presenceEventSchema = z.discriminatedUnion('event', [
  setStatusEventSchema,
  setCustomMessageEventSchema,
  userStatusChangedEventSchema,
  userPresenceUpdateEventSchema,
  usersOnlineListEventSchema,
])
```

---

### Exemplo 5: Implementar Gravação de Chamada

**Prompt:**

```
Adicione suporte para gravação de chamadas com os seguintes requisitos:

Eventos:
- RECORDING_START: iniciar gravação (quem pode: owner, admins)
- RECORDING_PAUSE: pausar gravação
- RECORDING_RESUME: retomar gravação
- RECORDING_STOP: parar e salvar gravação
- RECORDING_STATUS_CHANGED: notificar todos os participantes

Estados de Gravação:
- IDLE: não está gravando
- RECORDING: gravando ativamente
- PAUSED: pausado
- PROCESSING: processando vídeo
- COMPLETED: gravação salva
- FAILED: erro ao gravar

Dados necessários:
- callId: UUID
- recordingId: UUID (gerado no servidor)
- status: enum RecordingStatus
- startedBy: userId
- startedAt: timestamp
- duration: segundos
- fileUrl: URL do arquivo (quando completed)
- fileSize: bytes (quando completed)

Permissões:
- Apenas owner e admins podem iniciar/parar
- Todos são notificados quando gravação inicia
- Aviso visual durante gravação

Adicione schemas com validações apropriadas e eventos bidirecionais.
```

**Código Esperado:**

```typescript
// types.ts
export enum RecordingStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum RecordingEventType {
  RECORDING_START = 'RECORDING_START',
  RECORDING_PAUSE = 'RECORDING_PAUSE',
  RECORDING_RESUME = 'RECORDING_RESUME',
  RECORDING_STOP = 'RECORDING_STOP',
  RECORDING_STATUS_CHANGED = 'RECORDING_STATUS_CHANGED',
}

export interface RecordingStartEvent extends BaseCallEvent {
  event: RecordingEventType.RECORDING_START
  data: {
    callId: string
  }
}

export interface RecordingStatusChangedEvent extends BaseCallEvent {
  event: RecordingEventType.RECORDING_STATUS_CHANGED
  data: {
    callId: string
    recordingId: string
    status: RecordingStatus
    startedBy: string
    startedByName: string
    startedAt: Date
    duration?: number
    fileUrl?: string
    fileSize?: number
  }
}

// calls.schema.ts
export const recordingStartEventSchema = baseCallEventSchema.extend({
  event: z.literal(RecordingEventType.RECORDING_START),
  data: z.object({
    callId: z.string().uuid(),
  }),
})

export const recordingStatusChangedEventSchema = baseCallEventSchema.extend({
  event: z.literal(RecordingEventType.RECORDING_STATUS_CHANGED),
  data: z.object({
    callId: z.string().uuid(),
    recordingId: z.string().uuid(),
    status: z.nativeEnum(RecordingStatus),
    startedBy: z.string().uuid(),
    startedByName: z.string(),
    startedAt: z.coerce.date(),
    duration: z.number().min(0).optional(),
    fileUrl: z.string().url().optional(),
    fileSize: z.number().min(0).optional(),
  }),
})

// Adicionar ao discriminated union
export const callEventSchema = z.discriminatedUnion('event', [
  // ... eventos existentes
  recordingStartEventSchema,
  recordingPauseEventSchema,
  recordingResumeEventSchema,
  recordingStopEventSchema,
  recordingStatusChangedEventSchema,
])
```

---

## 🎯 Dicas para Melhores Resultados

### 1. Seja Específico

**❌ Vago:**

```
"Adicione suporte a arquivos"
```

**✅ Específico:**

```
"Adicione suporte a upload de arquivos no módulo de chat com:
- Tipos: PDF, DOC, DOCX, XLS, XLSX (max 10MB)
- Imagens: JPG, PNG, GIF (max 5MB)
- Vídeos: MP4, MOV (max 50MB)
- Validação de MIME type
- Geração de thumbnail para imagens
- Metadata: fileName, fileSize, mimeType
- Evento MEDIA_UPLOADED via WebSocket"
```

### 2. Referencie Padrões Existentes

**✅ Com referência:**

```
"Crie um módulo de reações similar ao módulo de chat, mas com:
- Reações podem ser em mensagens ou em posts
- Emoji picker com reações rápidas
- Contador de cada tipo de reação
- Lista de quem reagiu"
```

### 3. Inclua Casos de Uso

**✅ Com casos de uso:**

```
"Adicione sistema de notificações com prioridades:

Casos de uso:
1. Mensagem nova em chat direto → HIGH priority, push notification
2. Mensagem em grupo → NORMAL priority, badge apenas
3. Menção em grupo → HIGH priority, push notification
4. Chamada perdida → URGENT priority, push + sound
5. Reação em mensagem → LOW priority, in-app apenas

Eventos necessários:
- NOTIFICATION_CREATED (servidor → cliente)
- NOTIFICATION_READ (cliente → servidor)
- NOTIFICATION_DISMISSED (cliente → servidor)
"
```

### 4. Peça Revisões e Melhorias

```
✅ "Revise o módulo de grupos e sugira melhorias em:
   - Validações que podem estar faltando
   - Performance (índices, queries)
   - Segurança (permissões, sanitização)
   - Extensibilidade (futuras features)"

✅ "Este evento WebSocket está correto? Verifique:
   - Discriminated union
   - Validações
   - Campos opcionais vs obrigatórios
   - Compatibilidade com padrões existentes"

✅ "Como posso otimizar este schema para:
   - Reduzir duplicação de código
   - Facilitar manutenção
   - Melhorar type safety"
```

---

## 📚 Recursos para Copiar/Colar

### Template de Novo Módulo

```
Crie um módulo de [NOME] com:

Entidades:
- [Entidade1]: campos...
- [Entidade2]: campos...

Enums:
- [EnumName]: VALUES...

Rotas REST:
- [MÉTODO] [caminho] - [descrição]
- ...

Eventos WebSocket (se aplicável):
- [EVENTO_NOME] - [quando ocorre]
- ...

Validações especiais:
- [campo]: [regras]
- ...

Siga todos os padrões: DIP, satisfies, validações, response wrappers.
```

### Template de Novo Evento

```
Adicione evento WebSocket [NOME_EVENTO]:

Direção: [Cliente → Servidor] ou [Servidor → Cliente]

Quando ocorre: [descrição]

Dados:
- campo1: tipo (validação)
- campo2: tipo (validação)
- ...

Relação com outros eventos: [se aplicável]

Siga padrão: enum, interface, schema, discriminated union.
```

### Template de Validação

```
Adicione validações específicas para [CAMPO/SCHEMA]:

Regras:
1. [regra 1]
2. [regra 2]
...

Mensagens de erro customizadas:
- [campo]: [mensagem]
...

Edge cases a considerar:
- [caso 1]
- [caso 2]
...
```

---

**💡 Lembre-se:** Quanto mais contexto e especificidade você fornecer, melhores serão os resultados dos agentes!
