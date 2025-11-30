# GitHub Copilot - Agentes de IA Personalizados

Este diretório contém instruções personalizadas para o GitHub Copilot, criando "agentes especializados" que ajudam no desenvolvimento do monorepo de chat.

## 📑 Índice

> 💡 **[Ver Índice Completo](./INDEX.md)** - Navegação completa de toda documentação

### 🚀 Começando
- [👋 Onboarding](./ONBOARDING.md) - **Novo no projeto? Comece aqui!**
- [⚡ Referência Rápida](./QUICK-REFERENCE.md) - Comandos e padrões essenciais

### 📚 Documentação Principal
- [📖 Esta Página](#-agentes-disponíveis) - Visão geral dos agentes
- [💡 Exemplos Práticos](./EXAMPLES.md) - Casos de uso reais
- [🎨 Guia de Fluxo](./WORKFLOW-GUIDE.md) - Diagramas e fluxos visuais
- [❓ FAQ](./FAQ.md) - Perguntas frequentes

### 🤖 Agentes Especializados
- [🎯 Agente Geral](./copilot-instructions.md) - Arquitetura e padrões gerais
- [📦 Agente de Contratos](../packages/contracts/.github/copilot-instructions.md) - Schemas e rotas
- [🔌 Agente WebSocket](../packages/contracts/.github/copilot-websocket-instructions.md) - Eventos tempo real

---

## 📚 Agentes Disponíveis

### 1. 🎯 Agente Geral (Root)

**Arquivo:** `/.github/copilot-instructions.md`

**Escopo:** Todo o monorepo

**Especialização:**

- Arquitetura geral do projeto
- Princípios de DDD e Inversão de Dependência
- Estrutura de módulos
- Convenções de nomenclatura
- Validações com Zod
- Contratos ORPC

**Quando usar:**

- Criar novos módulos no pacote contracts
- Entender a arquitetura geral
- Dúvidas sobre estrutura e organização
- Revisar código existente

---

### 2. 📦 Agente de Contratos

**Arquivo:** `/packages/contracts/.github/copilot-instructions.md`

**Escopo:** Pacote `@packages/contracts`

**Especialização:**

- Criação de tipos TypeScript puros
- Schemas Zod com `satisfies`
- Contratos ORPC (rotas de API)
- Padrões de request/response
- Validações específicas
- Documentação de APIs

**Quando usar:**

- Criar novos módulos de domínio
- Adicionar rotas REST
- Definir schemas de validação
- Documentar contratos de API
- Refatorar tipos existentes

**Exemplo de uso:**

```typescript
// Pergunte: "Como criar um novo módulo de pagamentos?"
// O agente seguirá a estrutura:
// 1. types.ts - Interfaces puras
// 2. payments.schema.ts - Schemas Zod
// 3. payments.contract.ts - Rotas ORPC
// 4. index.ts - Exports
```

---

### 3. 🔌 Agente WebSocket & WebRTC

**Arquivo:** `/packages/contracts/.github/copilot-websocket-instructions.md`

**Escopo:** Eventos em tempo real e chamadas de vídeo

**Especialização:**

- Eventos WebSocket bidirecionais
- Sinalização WebRTC (offer/answer/ICE)
- Controle de mídia em chamadas
- Discriminated unions para eventos
- Fluxos de comunicação em tempo real

**Quando usar:**

- Criar novos eventos WebSocket
- Adicionar eventos de chamada
- Implementar sinalização WebRTC
- Depurar fluxos de eventos
- Documentar comunicação em tempo real

**Exemplo de uso:**

```typescript
// Pergunte: "Como criar um evento de screen sharing?"
// O agente seguirá o padrão:
// 1. Definir enum
// 2. Criar interface
// 3. Criar schema com validação
// 4. Adicionar ao discriminated union
```

---

## 🚀 Como Usar os Agentes

### No VS Code

1. **Automático:** O Copilot carrega automaticamente as instruções baseadas no arquivo que você está editando:

   - Editando `packages/contracts/src/modules/chat/types.ts`? → Agente de Contratos ativo
   - Editando `packages/contracts/src/modules/websocket/`? → Agente WebSocket ativo

2. **Chat do Copilot:**

   ```
   # Geral
   @workspace Como adicionar um novo módulo?

   # Contratos
   Como criar schemas Zod para o módulo de notificações?

   # WebSocket
   Como implementar um evento de status de presença?
   ```

3. **Inline Suggestions:**
   - Digite comentários descrevendo o que precisa
   - O Copilot sugerirá código seguindo os padrões dos agentes

### Exemplos Práticos

#### Criar Novo Módulo de Domínio

```typescript
// 1. Crie o diretório
packages/contracts/src/modules/payments/

// 2. Pergunte ao Copilot:
// "Crie os arquivos base para o módulo de pagamentos com:
//  - Entidade Payment com id, userId, amount, status
//  - Enum PaymentStatus: PENDING, COMPLETED, FAILED
//  - Rotas para criar pagamento e listar pagamentos"

// 3. O Copilot criará:
// - types.ts com interfaces puras
// - payments.schema.ts com validações Zod
// - payments.contract.ts com rotas ORPC
// - index.ts com exports
```

#### Adicionar Evento WebSocket

```typescript
// Em websocket/types.ts
// Pergunte: "Adicione um evento USER_STATUS_CHANGED que indica
// quando um usuário muda seu status para online/offline/away"

// O agente seguirá automaticamente:
// 1. Adicionar ao enum WebSocketEventType
// 2. Criar interface UserStatusChangedEvent
// 3. Criar schema com validação em websocket.schema.ts
// 4. Adicionar ao discriminated union
```

#### Implementar Sinalização WebRTC

```typescript
// Em calls/
// Pergunte: "Como implementar o fluxo completo de sinalização
// para compartilhamento de tela?"

// O agente fornecerá:
// 1. Eventos necessários (SCREEN_SHARE_START, SCREEN_SHARE_STOP)
// 2. Schemas WebRTC apropriados
// 3. Fluxo de offer/answer/candidate
// 4. Controles de mídia
```

---

## 🎨 Padrões Seguidos pelos Agentes

### Inversão de Dependência (DIP)

```typescript
// 1️⃣ types.ts - Contrato (interface)
export interface User {
  id: string
  email: string
}

// 2️⃣ *.schema.ts - Implementação (Zod)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
}) satisfies z.ZodType<User>
// ☝️ satisfies garante compatibilidade!

// 3️⃣ *.contract.ts - API (ORPC)
export const users = oc.prefix('/users').router({
  get: prefix.route({ method: 'GET', path: '/:id' }).output(userResponseSchema),
})
```

### Discriminated Unions para Eventos

```typescript
// Base
const baseEventSchema = z.object({
  event: z.nativeEnum(EventType),
  timestamp: z.coerce.date(),
})

// Eventos específicos
const messageEvent = baseEventSchema.extend({
  event: z.literal(EventType.MESSAGE),
  data: z.object({ content: z.string() }),
})

// Union
const allEvents = z.discriminatedUnion('event', [
  messageEvent,
  typingEvent,
  // ...
])
```

### Response Wrappers

```typescript
// Lista com paginação
export const usersListResponseSchema = z.object({
  users: z.array(userSchema),
  meta: metaSchema,
})

// Single item
export const userResponseSchema = z.object({
  user: userSchema,
  meta: metaSchema,
})
```

---

## 📋 Checklist de Qualidade

Os agentes sempre verificam:

### Para Novos Módulos

- [ ] Estrutura de 4 arquivos (types, schema, contract, index)
- [ ] Interfaces puras em types.ts
- [ ] Todos schemas com `satisfies z.ZodType<Interface>`
- [ ] Rotas com summary e description
- [ ] Validações apropriadas (uuid, email, min, max)
- [ ] Exports em index.ts
- [ ] Integrado em src/index.ts

### Para Eventos WebSocket

- [ ] Enum entry adicionado
- [ ] Interface com BaseWebSocketEvent
- [ ] Schema com z.literal() para event type
- [ ] Adicionado ao discriminated union
- [ ] Timestamp incluído
- [ ] RequestId opcional
- [ ] Documentado quando é emitido

### Para Sinalização WebRTC

- [ ] callId sempre presente
- [ ] targetUserId para rotas 1-to-1
- [ ] Estrutura SDP validada (type + sdp)
- [ ] ICE candidate estrutura validada
- [ ] Fluxo offer → answer → candidates documentado
- [ ] Compatível com WebRTC nativo

---

## 🔍 Dicas de Uso

### 1. Seja Específico

```
❌ "Crie um módulo de usuários"
✅ "Crie um módulo de usuários com campos id, email, name, avatar,
   rotas para criar, listar e atualizar"
```

### 2. Use Exemplos Existentes

```
✅ "Crie um módulo de notificações similar ao módulo de chat"
✅ "Adicione eventos de presença seguindo o padrão de typing events"
```

### 3. Peça Revisões

```
✅ "Revise este schema e garanta que está seguindo os padrões"
✅ "Este evento WebSocket está correto? Falta alguma validação?"
```

### 4. Explore Alternativas

```
✅ "Qual a melhor forma de modelar pagamentos recorrentes?"
✅ "Como estruturar eventos de grupo vs eventos diretos?"
```

---

## 🎯 Fluxo de Trabalho Recomendado

### Criar Novo Recurso

1. **Planeje** - Liste entidades, operações e eventos

   ```
   "Preciso de um sistema de reações. Quais entidades e rotas preciso?"
   ```

2. **Implemente** - Peça ao agente para criar os arquivos

   ```
   "Crie o módulo de reações com tipos, schemas e contratos"
   ```

3. **Revise** - Peça ao agente para validar

   ```
   "Revise o módulo de reações e verifique se está completo"
   ```

4. **Integre** - Conecte com outros módulos

   ```
   "Como integrar reações com o módulo de mensagens?"
   ```

5. **Documente** - Atualize documentação
   ```
   "Gere documentação para as rotas de reações"
   ```

### Depurar Problemas

1. **Identifique** - Mostre o erro ao agente

   ```
   "Estou tendo erro de tipo no messageSchema, o que está errado?"
   ```

2. **Corrija** - Peça sugestões de correção

   ```
   "Como corrigir este schema para ser compatível com a interface?"
   ```

3. **Teste** - Peça casos de teste
   ```
   "Quais cenários devo testar para validar este evento WebSocket?"
   ```

---

## 📚 Recursos Adicionais

### Documentação do Projeto

- [Arquitetura de Contratos](../packages/contracts/ARCHITECTURE.md)
- [WebSocket - Chat](../packages/contracts/docs/WebSocket.md)
- [Chamadas WebRTC](../packages/contracts/docs/CALLS.md)
- [README Principal](../README.md)

### Documentação Externa

- [ORPC](https://orpc.dev/)
- [Zod](https://zod.dev/)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

### Exemplos no Código

- `packages/contracts/src/modules/chat/` - Sistema completo de chat
- `packages/contracts/src/modules/calls/` - Chamadas WebRTC
- `packages/contracts/src/modules/websocket/` - Eventos em tempo real

---

## 🤝 Contribuindo

Ao adicionar novos padrões ou convenções:

1. Atualize o agente apropriado
2. Adicione exemplos práticos
3. Documente casos de uso
4. Teste com o Copilot
5. Compartilhe com o time

---

## ⚡ Atalhos Úteis

```bash
# Perguntas rápidas ao Copilot

# Geral
@workspace estrutura do projeto

# Criar módulo
como criar módulo de [domínio]

# Adicionar evento
adicionar evento WebSocket [nome]

# WebRTC
implementar sinalização para [feature]

# Validação
validar [tipo de dado] com Zod

# Rotas
criar rota REST para [ação]
```

---

**Lembre-se:** Os agentes são assistentes, não substituem o entendimento dos padrões. Use-os para acelerar e manter consistência!
