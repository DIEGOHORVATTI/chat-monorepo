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
├── WEBSOCKET.md        # Documentação WebSocket (chat)
├── CALLS.md            # Documentação de chamadas
└── README.md           # Este arquivo
```

#### Recursos:

- ✅ Chamadas 1-a-1 e em grupo
- ✅ Áudio e vídeo
- ✅ Controles (mute, video on/off)
- ✅ Compartilhamento de tela
- ✅ Sinalização WebRTC via WebSocket
- ✅ ICE candidates para NAT traversal
- 🆕 ✅ Gravação de chamadas com armazenamento

📖 [Documentação completa de Chamadas](./docs/CALLS.md)

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
  id: z.uuid(),
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
  event: z.enum(EventType),
  timestamp: z.date(),
  requestId: z.uuid().optional(),
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
