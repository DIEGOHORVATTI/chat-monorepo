# WebSocket Events - Chat Real-time Communication

Este documento descreve os eventos WebSocket disponíveis para comunicação em tempo real no sistema de chat.

## Conexão

### Endpoint

```
ws://your-domain/ws?token=YOUR_JWT_TOKEN
```

### Autenticação

A autenticação é feita via JWT token, que pode ser passado de duas formas:

1. Query parameter: `?token=YOUR_JWT_TOKEN`
2. Authorization header: `Authorization: Bearer YOUR_JWT_TOKEN`

### Exemplo de Conexão (TypeScript)

```typescript
const token = 'YOUR_JWT_TOKEN'
const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`)

ws.onopen = () => {
  console.log('WebSocket connected')
}

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  console.log('Received:', message)
}

ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}

ws.onclose = () => {
  console.log('WebSocket disconnected')
}
```

## Formato das Mensagens

Todas as mensagens seguem o formato:

```typescript
{
  event: string,           // Tipo do evento
  timestamp: Date,         // Data/hora do evento
  requestId?: string,      // ID único da requisição (opcional)
  data: object            // Dados específicos do evento
}
```

## Eventos Cliente → Servidor

### 1. JOIN_CHAT

Entrar em uma sala de chat para receber atualizações em tempo real.

```typescript
{
  event: 'JOIN_CHAT',
  timestamp: new Date(),
  requestId: 'uuid',
  data: {
    chatId: 'chat-uuid'
  }
}
```

### 2. LEAVE_CHAT

Sair de uma sala de chat.

```typescript
{
  event: 'LEAVE_CHAT',
  timestamp: new Date(),
  data: {
    chatId: 'chat-uuid'
  }
}
```

### 3. TYPING_START

Indicar que o usuário começou a digitar.

```typescript
{
  event: 'TYPING_START',
  timestamp: new Date(),
  data: {
    chatId: 'chat-uuid'
  }
}
```

### 4. TYPING_STOP

Indicar que o usuário parou de digitar.

```typescript
{
  event: 'TYPING_STOP',
  timestamp: new Date(),
  data: {
    chatId: 'chat-uuid'
  }
}
```

### 5. MESSAGE_SEND

Enviar uma nova mensagem.

```typescript
{
  event: 'MESSAGE_SEND',
  timestamp: new Date(),
  requestId: 'uuid',
  data: {
    chatId: 'chat-uuid',
    content: 'Olá!',
    type: 'TEXT',
    replyToId?: 'message-uuid',
    metadata?: { key: 'value' }
  }
}
```

### 6. MESSAGE_READ

Marcar uma mensagem como lida.

```typescript
{
  event: 'MESSAGE_READ',
  timestamp: new Date(),
  data: {
    messageId: 'message-uuid',
    chatId: 'chat-uuid'
  }
}
```

### 7. PING

Heartbeat para manter a conexão ativa.

```typescript
{
  event: 'PING',
  timestamp: new Date()
}
```

## Eventos Servidor → Cliente

### 1. CONNECTION_ACK

Confirmação de conexão estabelecida.

```typescript
{
  event: 'CONNECTION_ACK',
  timestamp: Date,
  data: {
    userId: 'user-uuid',
    sessionId: 'session-uuid',
    connectedAt: Date
  }
}
```

### 2. MESSAGE_RECEIVED

Nova mensagem recebida.

```typescript
{
  event: 'MESSAGE_RECEIVED',
  timestamp: Date,
  data: {
    messageId: 'uuid',
    chatId: 'uuid',
    senderId: 'uuid',
    senderName: 'João Silva',
    senderAvatar: 'https://...',
    content: 'Olá!',
    type: 'TEXT',
    status: 'SENT',
    replyToId?: 'uuid',
    metadata?: {},
    createdAt: Date
  }
}
```

### 3. MESSAGE_UPDATED

Mensagem foi editada.

```typescript
{
  event: 'MESSAGE_UPDATED',
  timestamp: Date,
  data: {
    messageId: 'uuid',
    chatId: 'uuid',
    content: 'Texto atualizado',
    updatedAt: Date
  }
}
```

### 4. MESSAGE_DELETED

Mensagem foi deletada.

```typescript
{
  event: 'MESSAGE_DELETED',
  timestamp: Date,
  data: {
    messageId: 'uuid',
    chatId: 'uuid',
    deletedAt: Date
  }
}
```

### 5. MESSAGE_STATUS_CHANGED

Status da mensagem mudou (entregue/lida).

```typescript
{
  event: 'MESSAGE_STATUS_CHANGED',
  timestamp: Date,
  data: {
    messageId: 'uuid',
    chatId: 'uuid',
    status: 'READ',
    readBy?: [{
      userId: 'uuid',
      readAt: Date
    }]
  }
}
```

### 6. USER_TYPING

Outro usuário está digitando.

```typescript
{
  event: 'USER_TYPING',
  timestamp: Date,
  data: {
    chatId: 'uuid',
    userId: 'uuid',
    userName: 'Maria Santos',
    isTyping: true
  }
}
```

### 7. USER_ONLINE

Usuário ficou online.

```typescript
{
  event: 'USER_ONLINE',
  timestamp: Date,
  data: {
    userId: 'uuid',
    userName: 'João Silva',
    lastSeen: Date
  }
}
```

### 8. USER_OFFLINE

Usuário ficou offline.

```typescript
{
  event: 'USER_OFFLINE',
  timestamp: Date,
  data: {
    userId: 'uuid',
    userName: 'João Silva',
    lastSeen: Date
  }
}
```

### 9. CHAT_UPDATED

Detalhes do chat foram atualizados.

```typescript
{
  event: 'CHAT_UPDATED',
  timestamp: Date,
  data: {
    chatId: 'uuid',
    name?: 'Novo Nome',
    avatarUrl?: 'https://...',
    updatedAt: Date
  }
}
```

### 10. PARTICIPANT_JOINED

Novo participante entrou no chat.

```typescript
{
  event: 'PARTICIPANT_JOINED',
  timestamp: Date,
  data: {
    chatId: 'uuid',
    userId: 'uuid',
    userName: 'Pedro Costa',
    userAvatar?: 'https://...',
    role: 'member',
    joinedAt: Date
  }
}
```

### 11. PARTICIPANT_LEFT

Participante saiu do chat.

```typescript
{
  event: 'PARTICIPANT_LEFT',
  timestamp: Date,
  data: {
    chatId: 'uuid',
    userId: 'uuid',
    userName: 'Pedro Costa',
    leftAt: Date
  }
}
```

### 12. ERROR

Erro ocorreu.

```typescript
{
  event: 'ERROR',
  timestamp: Date,
  data: {
    code: 'UNAUTHORIZED',
    message: 'Token inválido',
    details?: {}
  }
}
```

### 13. PONG

Resposta ao PING.

```typescript
{
  event: 'PONG',
  timestamp: Date,
  data: {
    latency?: 45
  }
}
```

## Exemplo de Implementação Completa

```typescript
import { WebSocketEventType } from '@/contracts'

class ChatWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(token: string) {
    this.ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`)

    this.ws.onopen = this.handleOpen.bind(this)
    this.ws.onmessage = this.handleMessage.bind(this)
    this.ws.onerror = this.handleError.bind(this)
    this.ws.onclose = this.handleClose.bind(this)
  }

  private handleOpen() {
    console.log('WebSocket conectado')
    this.reconnectAttempts = 0
  }

  private handleMessage(event: MessageEvent) {
    const message = JSON.parse(event.data)

    switch (message.event) {
      case WebSocketEventType.CONNECTION_ACK:
        console.log('Conexão confirmada:', message.data)
        break

      case WebSocketEventType.MESSAGE_RECEIVED:
        this.onMessageReceived(message.data)
        break

      case WebSocketEventType.USER_TYPING:
        this.onUserTyping(message.data)
        break

      case WebSocketEventType.MESSAGE_STATUS_CHANGED:
        this.onMessageStatusChanged(message.data)
        break

      // Adicionar outros casos conforme necessário
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket erro:', error)
  }

  private handleClose() {
    console.log('WebSocket desconectado')
    this.reconnect()
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * this.reconnectAttempts

      console.log(`Tentando reconectar em ${delay}ms...`)

      setTimeout(() => {
        // Reconectar com o mesmo token
        this.connect(this.token)
      }, delay)
    }
  }

  joinChat(chatId: string) {
    this.send({
      event: WebSocketEventType.JOIN_CHAT,
      timestamp: new Date(),
      data: { chatId },
    })
  }

  sendMessage(chatId: string, content: string) {
    this.send({
      event: WebSocketEventType.MESSAGE_SEND,
      timestamp: new Date(),
      requestId: crypto.randomUUID(),
      data: {
        chatId,
        content,
        type: 'TEXT',
      },
    })
  }

  startTyping(chatId: string) {
    this.send({
      event: WebSocketEventType.TYPING_START,
      timestamp: new Date(),
      data: { chatId },
    })
  }

  stopTyping(chatId: string) {
    this.send({
      event: WebSocketEventType.TYPING_STOP,
      timestamp: new Date(),
      data: { chatId },
    })
  }

  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.error('WebSocket não está conectado')
    }
  }

  // Callbacks personalizados
  private onMessageReceived(data: any) {
    console.log('Nova mensagem:', data)
  }

  private onUserTyping(data: any) {
    console.log('Usuário digitando:', data)
  }

  private onMessageStatusChanged(data: any) {
    console.log('Status da mensagem mudou:', data)
  }

  disconnect() {
    this.ws?.close()
  }
}

// Uso
const chatWS = new ChatWebSocket()
chatWS.connect('YOUR_JWT_TOKEN')
chatWS.joinChat('chat-uuid')
chatWS.sendMessage('chat-uuid', 'Olá!')
```

## Boas Práticas

1. **Heartbeat**: Envie PING a cada 30 segundos para manter a conexão ativa
2. **Reconexão**: Implemente lógica de reconexão automática com backoff exponencial
3. **Request ID**: Use `requestId` para rastrear requisições e respostas
4. **Tratamento de Erros**: Sempre trate eventos de ERROR
5. **Cleanup**: Sempre envie LEAVE_CHAT antes de desconectar
6. **Estado Local**: Mantenha estado local sincronizado com eventos recebidos
7. **Throttling**: Limite a frequência de eventos TYPING para não sobrecarregar o servidor

## Estados de Mensagem

- **SENT**: Mensagem enviada ao servidor
- **DELIVERED**: Mensagem entregue aos destinatários
- **READ**: Mensagem lida por pelo menos um destinatário
- **FAILED**: Falha ao enviar mensagem
