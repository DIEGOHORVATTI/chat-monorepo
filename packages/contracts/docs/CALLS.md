# Sistema de Chamadas de Áudio e Vídeo

Este documento descreve o sistema completo de chamadas de áudio e vídeo usando WebRTC e WebSocket para sinalização.

## Arquitetura

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client A  │◄────────►│   Server    │◄────────►│   Client B  │
│  (Browser)  │         │  (WebSocket │         │  (Browser)  │
│             │         │  + Signaling)│         │             │
└─────────────┘         └─────────────┘         └─────────────┘
       │                                                │
       │                                                │
       └────────────────WebRTC P2P────────────────────┘
                    (Audio/Video direct)
```

## Tipos de Chamadas

- **AUDIO**: Chamada apenas de áudio
- **VIDEO**: Chamada de vídeo (inclui áudio)

## Status da Chamada

- **RINGING**: Chamando participantes
- **CONNECTING**: Estabelecendo conexão WebRTC
- **CONNECTED**: Chamada ativa
- **ENDED**: Chamada encerrada normalmente
- **MISSED**: Chamada não atendida
- **DECLINED**: Chamada recusada
- **FAILED**: Falha na conexão
- **BUSY**: Usuário ocupado em outra chamada

## Fluxo de Chamada

### 1. Iniciar Chamada (REST API)

```typescript
POST /calls

{
  "chatId": "chat-uuid", // opcional
  "participantIds": ["user-uuid-1", "user-uuid-2"],
  "type": "VIDEO"
}

Response:
{
  "call": {
    "id": "call-uuid",
    "roomId": "room-uuid",
    "type": "VIDEO",
    "status": "RINGING",
    "initiatorId": "current-user-uuid",
    "participants": [...],
    "startedAt": "2025-11-29T10:00:00.000Z"
  }
}
```

### 2. Receber Notificação de Chamada (WebSocket)

```typescript
// Server -> Client
{
  "event": "CALL_INCOMING",
  "timestamp": "2025-11-29T10:00:00.000Z",
  "data": {
    "callId": "call-uuid",
    "type": "VIDEO",
    "initiatorId": "user-uuid",
    "initiatorName": "João Silva",
    "initiatorAvatar": "https://...",
    "participants": [
      { "userId": "user-uuid-2", "userName": "Maria" }
    ],
    "roomId": "room-uuid"
  }
}
```

### 3. Responder à Chamada (WebSocket)

```typescript
// Client -> Server (Aceitar)
{
  "event": "CALL_ANSWER",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid"
  }
}

// Client -> Server (Recusar)
{
  "event": "CALL_DECLINE",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid",
    "reason": "Estou ocupado"
  }
}
```

### 4. WebRTC Signaling

#### 4.1 Criar e Enviar Offer

```typescript
// Client A: Criar peer connection
const peerConnection = new RTCPeerConnection(config)

// Adicionar streams locais
const localStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})

localStream.getTracks().forEach(track => {
  peerConnection.addTrack(track, localStream)
})

// Criar offer
const offer = await peerConnection.createOffer()
await peerConnection.setLocalDescription(offer)

// Enviar offer via WebSocket
{
  "event": "WEBRTC_OFFER",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid",
    "targetUserId": "user-uuid-b",
    "offer": {
      "type": "offer",
      "sdp": "v=0\r\no=- ..."
    }
  }
}
```

#### 4.2 Receber e Responder Offer

```typescript
// Client B recebe via WebSocket
{
  "event": "WEBRTC_OFFER_RECEIVED",
  "timestamp": "2025-11-29T10:00:01.000Z",
  "data": {
    "callId": "call-uuid",
    "fromUserId": "user-uuid-a",
    "fromUserName": "João",
    "offer": {
      "type": "offer",
      "sdp": "v=0\r\no=- ..."
    }
  }
}

// Client B: Configurar peer connection
await peerConnection.setRemoteDescription(offer)

// Criar answer
const answer = await peerConnection.createAnswer()
await peerConnection.setLocalDescription(answer)

// Enviar answer
{
  "event": "WEBRTC_ANSWER",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid",
    "targetUserId": "user-uuid-a",
    "answer": {
      "type": "answer",
      "sdp": "v=0\r\no=- ..."
    }
  }
}
```

#### 4.3 Trocar ICE Candidates

```typescript
// Quando ICE candidate é descoberto
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // Enviar via WebSocket
    ws.send(JSON.stringify({
      "event": "WEBRTC_ICE_CANDIDATE",
      "timestamp": new Date(),
      "data": {
        "callId": "call-uuid",
        "targetUserId": "other-user-uuid",
        "candidate": {
          "candidate": event.candidate.candidate,
          "sdpMid": event.candidate.sdpMid,
          "sdpMLineIndex": event.candidate.sdpMLineIndex
        }
      }
    }))
  }
}

// Quando recebe ICE candidate
{
  "event": "WEBRTC_ICE_CANDIDATE_RECEIVED",
  "data": {
    "callId": "call-uuid",
    "fromUserId": "user-uuid",
    "candidate": {...}
  }
}

// Adicionar ao peer connection
await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
```

### 5. Gerenciar Mídia Durante a Chamada

```typescript
// Silenciar/dessilenciar áudio
{
  "event": "CALL_PARTICIPANT_MEDIA_UPDATE",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid",
    "isMuted": true
  }
}

// Ativar/desativar vídeo
{
  "event": "CALL_PARTICIPANT_MEDIA_UPDATE",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid",
    "isVideoEnabled": false
  }
}

// Compartilhar tela
{
  "event": "CALL_PARTICIPANT_MEDIA_UPDATE",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid",
    "isSharingScreen": true
  }
}

// Todos os participantes recebem
{
  "event": "CALL_PARTICIPANT_MEDIA_CHANGED",
  "timestamp": "2025-11-29T10:05:00.000Z",
  "data": {
    "callId": "call-uuid",
    "userId": "user-uuid",
    "userName": "João",
    "isMuted": true,
    "isVideoEnabled": true,
    "isSharingScreen": false
  }
}
```

### 6. Encerrar Chamada

```typescript
// Client -> Server
{
  "event": "CALL_END",
  "timestamp": new Date(),
  "data": {
    "callId": "call-uuid"
  }
}

// Server -> All Clients
{
  "event": "CALL_ENDED",
  "timestamp": "2025-11-29T10:10:00.000Z",
  "data": {
    "callId": "call-uuid",
    "duration": 600, // 10 minutos
    "endedBy": "user-uuid",
    "reason": "Chamada encerrada normalmente"
  }
}
```

## Rotas REST API

### Gerenciamento de Chamadas

```typescript
// Iniciar chamada
POST /calls
Body: { chatId?, participantIds, type }

// Atender/Recusar chamada
POST /calls/:callId/answer
Body: { accept: boolean }

// Encerrar chamada
POST /calls/:callId/end

// Obter detalhes da chamada
GET /calls/:callId

// Listar chamadas ativas
GET /calls/active?page=1&limit=10

// Histórico de chamadas
GET /calls/history?chatId=uuid&type=VIDEO&page=1

// Adicionar participantes
POST /calls/:callId/participants
Body: { participantIds: [] }

// Atualizar mídia
PATCH /calls/:callId/media
Body: { isMuted?, isVideoEnabled?, isSharingScreen? }

// Listar participantes
GET /calls/:callId/participants
```

### Sinalização WebRTC (via REST)

```typescript
// Enviar offer
POST /calls/signaling/offer
Body: { callId, targetUserId, offer }

// Enviar answer
POST /calls/signaling/answer
Body: { callId, targetUserId, answer }

// Enviar ICE candidate
POST /calls/signaling/ice-candidate
Body: { callId, targetUserId?, candidate }
```

## Eventos WebSocket

### Cliente → Servidor

- `CALL_INITIATE` - Iniciar chamada
- `CALL_ANSWER` - Aceitar chamada
- `CALL_DECLINE` - Recusar chamada
- `CALL_END` - Encerrar chamada
- `CALL_PARTICIPANT_MEDIA_UPDATE` - Atualizar mídia
- `WEBRTC_OFFER` - Enviar offer WebRTC
- `WEBRTC_ANSWER` - Enviar answer WebRTC
- `WEBRTC_ICE_CANDIDATE` - Enviar ICE candidate

### Servidor → Cliente

- `CALL_INCOMING` - Chamada recebida
- `CALL_STARTED` - Chamada iniciada
- `CALL_ENDED` - Chamada encerrada
- `CALL_PARTICIPANT_JOINED` - Participante entrou
- `CALL_PARTICIPANT_LEFT` - Participante saiu
- `CALL_PARTICIPANT_MEDIA_CHANGED` - Mídia do participante mudou
- `CALL_STATUS_CHANGED` - Status da chamada mudou
- `WEBRTC_OFFER_RECEIVED` - Offer WebRTC recebido
- `WEBRTC_ANSWER_RECEIVED` - Answer WebRTC recebido
- `WEBRTC_ICE_CANDIDATE_RECEIVED` - ICE candidate recebido

## Implementação Completa (Exemplo)

```typescript
import { CallWebSocketEventType } from '@/contracts'

class VideoCallManager {
  private ws: WebSocket
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null

  constructor(wsUrl: string, token: string) {
    this.ws = new WebSocket(`${wsUrl}?token=${token}`)
    this.ws.onmessage = this.handleMessage.bind(this)
  }

  // Iniciar chamada
  async startCall(participantIds: string[], type: 'AUDIO' | 'VIDEO') {
    // Obter mídia local
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: type === 'VIDEO',
      audio: true,
    })

    // Enviar via WebSocket
    this.send({
      event: CallWebSocketEventType.CALL_INITIATE,
      timestamp: new Date(),
      data: {
        participantIds,
        type,
      },
    })
  }

  // Atender chamada
  async answerCall(callId: string) {
    // Obter mídia local
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    this.send({
      event: CallWebSocketEventType.CALL_ANSWER,
      timestamp: new Date(),
      data: { callId },
    })
  }

  // Criar peer connection
  private async createPeerConnection(callId: string, userId: string) {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Adicionar TURN servers para produção
      ],
    }

    const pc = new RTCPeerConnection(config)
    this.peerConnections.set(userId, pc)

    // Adicionar tracks locais
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!)
      })
    }

    // Lidar com tracks remotos
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.onRemoteStream?.(userId, remoteStream)
    }

    // Lidar com ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.send({
          event: CallWebSocketEventType.WEBRTC_ICE_CANDIDATE,
          timestamp: new Date(),
          data: {
            callId,
            targetUserId: userId,
            candidate: {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
            },
          },
        })
      }
    }

    return pc
  }

  // Criar e enviar offer
  private async createOffer(callId: string, userId: string) {
    const pc = await this.createPeerConnection(callId, userId)
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    this.send({
      event: CallWebSocketEventType.WEBRTC_OFFER,
      timestamp: new Date(),
      data: {
        callId,
        targetUserId: userId,
        offer: {
          type: 'offer',
          sdp: offer.sdp!,
        },
      },
    })
  }

  // Lidar com mensagens WebSocket
  private async handleMessage(event: MessageEvent) {
    const message = JSON.parse(event.data)

    switch (message.event) {
      case CallWebSocketEventType.CALL_INCOMING:
        await this.handleIncomingCall(message.data)
        break

      case CallWebSocketEventType.CALL_STARTED:
        await this.handleCallStarted(message.data)
        break

      case CallWebSocketEventType.WEBRTC_OFFER_RECEIVED:
        await this.handleOfferReceived(message.data)
        break

      case CallWebSocketEventType.WEBRTC_ANSWER_RECEIVED:
        await this.handleAnswerReceived(message.data)
        break

      case CallWebSocketEventType.WEBRTC_ICE_CANDIDATE_RECEIVED:
        await this.handleIceCandidateReceived(message.data)
        break

      case CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_CHANGED:
        this.onParticipantMediaChanged?.(message.data)
        break

      case CallWebSocketEventType.CALL_ENDED:
        await this.handleCallEnded(message.data)
        break
    }
  }

  private async handleOfferReceived(data: any) {
    const pc = await this.createPeerConnection(data.callId, data.fromUserId)

    await pc.setRemoteDescription(new RTCSessionDescription(data.offer))

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    this.send({
      event: CallWebSocketEventType.WEBRTC_ANSWER,
      timestamp: new Date(),
      data: {
        callId: data.callId,
        targetUserId: data.fromUserId,
        answer: {
          type: 'answer',
          sdp: answer.sdp!,
        },
      },
    })
  }

  private async handleAnswerReceived(data: any) {
    const pc = this.peerConnections.get(data.fromUserId)
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
    }
  }

  private async handleIceCandidateReceived(data: any) {
    const pc = this.peerConnections.get(data.fromUserId)
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  }

  // Controles de mídia
  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled

      this.send({
        event: CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_UPDATE,
        data: {
          callId: this.currentCallId,
          isMuted: !audioTrack.enabled,
        },
      })
    }
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled

      this.send({
        event: CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_UPDATE,
        data: {
          callId: this.currentCallId,
          isVideoEnabled: videoTrack.enabled,
        },
      })
    }
  }

  async shareScreen() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      })

      // Substituir track de vídeo pelo da tela
      const videoTrack = screenStream.getVideoTracks()[0]

      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })

      this.send({
        event: CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_UPDATE,
        data: {
          callId: this.currentCallId,
          isSharingScreen: true,
        },
      })
    } catch (error) {
      console.error('Erro ao compartilhar tela:', error)
    }
  }

  endCall() {
    this.send({
      event: CallWebSocketEventType.CALL_END,
      data: { callId: this.currentCallId },
    })

    this.cleanup()
  }

  private cleanup() {
    // Fechar peer connections
    this.peerConnections.forEach((pc) => pc.close())
    this.peerConnections.clear()

    // Parar tracks locais
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  private send(data: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  // Callbacks
  onRemoteStream?: (userId: string, stream: MediaStream) => void
  onParticipantMediaChanged?: (data: any) => void
}

// Uso
const callManager = new VideoCallManager('ws://localhost:3000/ws', 'JWT_TOKEN')

// Callbacks
callManager.onRemoteStream = (userId, stream) => {
  const videoElement = document.getElementById(`video-${userId}`)
  videoElement.srcObject = stream
}

// Iniciar chamada
await callManager.startCall(['user-id-1', 'user-id-2'], 'VIDEO')
```

## Boas Práticas

1. **STUN/TURN Servers**: Configure servidores TURN para garantir conectividade em redes restritivas
2. **Fallback**: Implemente fallback para áudio-only se vídeo falhar
3. **Qualidade Adaptativa**: Ajuste qualidade baseado na largura de banda
4. **Timeout**: Implemente timeouts para chamadas não atendidas (30-60 segundos)
5. **Reconexão**: Tente reconectar em caso de falha temporária
6. **Cleanup**: Sempre limpe recursos (peer connections, streams) ao encerrar
7. **Permissões**: Solicite permissões de câmera/microfone antes de iniciar chamada
8. **Notificações**: Use notificações do navegador para chamadas recebidas
9. **UI Feedback**: Mostre estados claros (conectando, chamando, conectado)
10. **Logs**: Registre eventos WebRTC para debug

## Servidores STUN/TURN Recomendados

```typescript
const iceServers = [
  // STUN público do Google
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },

  // TURN (configurar seu próprio servidor)
  {
    urls: 'turn:your-turn-server.com:3478',
    username: 'user',
    credential: 'pass',
  },
]
```

## Monitoramento de Qualidade

```typescript
// Obter estatísticas da conexão
setInterval(async () => {
  const pc = peerConnections.get(userId)
  if (pc) {
    const stats = await pc.getStats()
    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        console.log('Packets received:', report.packetsReceived)
        console.log('Packets lost:', report.packetsLost)
        console.log('Jitter:', report.jitter)
      }
    })
  }
}, 1000)
```
