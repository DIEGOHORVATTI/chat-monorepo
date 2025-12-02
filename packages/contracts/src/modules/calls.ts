import { oc } from '@orpc/contract'
import { z } from 'zod'
import { messageResponseSchema, meta as metaSchema, paginationSchema } from '../shared/base.schema'

enum CallType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

enum CallStatus {
  RINGING = 'RINGING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ENDED = 'ENDED',
  MISSED = 'MISSED',
  DECLINED = 'DECLINED',
  FAILED = 'FAILED',
  BUSY = 'BUSY',
}

enum ParticipantStatus {
  INVITED = 'INVITED',
  RINGING = 'RINGING',
  JOINED = 'JOINED',
  LEFT = 'LEFT',
  DECLINED = 'DECLINED',
  MISSED = 'MISSED',
}

const callParticipantSchema = z.object({
  id: z.uuid(),
  callId: z.uuid(),
  userId: z.uuid(),
  userName: z.string(),
  userAvatar: z.url().nullable().optional(),
  status: z.enum(ParticipantStatus),
  joinedAt: z.date().nullable().optional(),
  leftAt: z.date().nullable().optional(),
  isMuted: z.boolean().default(false),
  isVideoEnabled: z.boolean().default(false),
  isSharingScreen: z.boolean().default(false),
})

const callSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid().nullable().optional(),
  type: z.enum(CallType),
  status: z.enum(CallStatus),
  initiatorId: z.uuid(),
  participants: z.array(callParticipantSchema),
  startedAt: z.date(),
  endedAt: z.date().nullable().optional(),
  duration: z.number().nullable().optional(),
  roomId: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const initiateCallSchema = z.object({
  chatId: z.uuid().optional(),
  participantIds: z.array(z.uuid()).min(1),
  type: z.enum(CallType),
})

const answerCallSchema = z.object({
  callId: z.uuid(),
  accept: z.boolean(),
})

const endCallSchema = z.object({
  callId: z.uuid(),
})

const updateParticipantMediaSchema = z.object({
  callId: z.uuid(),
  isMuted: z.boolean().optional(),
  isVideoEnabled: z.boolean().optional(),
  isSharingScreen: z.boolean().optional(),
})

const addParticipantsToCallSchema = z.object({
  callId: z.uuid(),
  participantIds: z.array(z.uuid()).min(1),
})

const callQuerySchema = paginationSchema.extend({
  status: z.enum(CallStatus).optional(),
  type: z.enum(CallType).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

const callHistoryQuerySchema = paginationSchema.extend({
  chatId: z.uuid().optional(),
  type: z.enum(CallType).optional(),
})

const webRTCOfferSchema = z.object({
  callId: z.uuid(),
  targetUserId: z.uuid(),
  offer: z.object({
    type: z.literal('offer'),
    sdp: z.string(),
  }),
})

const webRTCAnswerSchema = z.object({
  callId: z.uuid(),
  targetUserId: z.uuid(),
  answer: z.object({
    type: z.literal('answer'),
    sdp: z.string(),
  }),
})

const webRTCIceCandidateSchema = z.object({
  callId: z.uuid(),
  targetUserId: z.uuid().optional(),
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable(),
    sdpMLineIndex: z.number().nullable(),
  }),
})

const callResponseSchema = z.object({
  data: callSchema,
  meta: metaSchema,
})

const callsListResponseSchema = z.object({
  data: z.array(callSchema),
  meta: metaSchema,
})

const callParticipantResponseSchema = z.object({
  data: callParticipantSchema,
  meta: metaSchema,
})

const callParticipantsResponseSchema = z.object({
  data: z.array(callParticipantSchema),
  meta: metaSchema,
})

const webRTCSignalingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

const callRecordingSchema = z.object({
  id: z.uuid(),
  callId: z.uuid(),
  startedAt: z.date(),
  endedAt: z.date().nullable().optional(),
  duration: z.number().nullable().optional(),
  fileUrl: z.url().nullable().optional(),
  fileSize: z.number().nullable().optional(),
  status: z.enum(['recording', 'processing', 'completed', 'failed']),
  createdAt: z.date(),
})

const startRecordingSchema = z.object({
  callId: z.uuid(),
})

const stopRecordingSchema = z.object({
  callId: z.uuid(),
  recordingId: z.uuid(),
})

const callRecordingsQuerySchema = paginationSchema.extend({
  callId: z.uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

const recordingResponseSchema = z.object({
  data: callRecordingSchema,
  meta: metaSchema,
})

const recordingsListResponseSchema = z.object({
  data: z.array(callRecordingSchema),
  meta: metaSchema,
})

const reportCallQualitySchema = z.object({
  callId: z.uuid(),
  rating: z.number().min(1).max(5),
  issues: z
    .array(z.enum(['AUDIO_ISSUES', 'VIDEO_ISSUES', 'CONNECTION_ISSUES', 'OTHER']))
    .optional(),
  feedback: z.string().max(500).optional(),
})

const callStatisticsSchema = z.object({
  callId: z.uuid(),
  duration: z.number(),
  audioLatency: z.number(),
  videoLatency: z.number(),
  packetLoss: z.number(),
  jitter: z.number(),
  bitrate: z.number(),
})

const callStatisticsResponseSchema = z.object({
  data: callStatisticsSchema,
  meta: metaSchema,
})

const prefix = oc.route({ tags: ['Calls'] })

export const calls = oc.prefix('/calls').router({
  initiateCall: prefix
    .route({
      method: 'POST',
      path: '/',
      summary: 'Iniciar chamada',
      description: 'Inicia uma nova chamada de áudio ou vídeo com um ou mais participantes',
    })
    .input(initiateCallSchema)
    .output(callResponseSchema),

  answerCall: prefix
    .route({
      method: 'POST',
      path: '/:callId/answer',
      summary: 'Atender chamada',
      description: 'Aceita ou recusa uma chamada recebida',
    })
    .input(answerCallSchema)
    .output(callResponseSchema),

  endCall: prefix
    .route({
      method: 'POST',
      path: '/:callId/end',
      summary: 'Encerrar chamada',
      description: 'Encerra uma chamada ativa',
    })
    .input(endCallSchema)
    .output(messageResponseSchema),

  getCall: prefix
    .route({
      method: 'GET',
      path: '/:callId',
      summary: 'Obter chamada',
      description: 'Obtém detalhes de uma chamada específica',
    })
    .output(callResponseSchema),

  listActiveCalls: prefix
    .route({
      method: 'GET',
      path: '/active',
      summary: 'Listar chamadas ativas',
      description: 'Lista todas as chamadas ativas do usuário atual',
    })
    .input(callQuerySchema)
    .output(callsListResponseSchema),

  getCallHistory: prefix
    .route({
      method: 'GET',
      path: '/history',
      summary: 'Obter histórico de chamadas',
      description: 'Obtém o histórico de chamadas com paginação',
    })
    .input(callHistoryQuerySchema)
    .output(callsListResponseSchema),

  addParticipants: prefix
    .route({
      method: 'POST',
      path: '/:callId/participants',
      summary: 'Adicionar participantes',
      description: 'Adiciona mais participantes a uma chamada em andamento',
    })
    .input(addParticipantsToCallSchema)
    .output(callParticipantsResponseSchema),

  updateMedia: prefix
    .route({
      method: 'PATCH',
      path: '/:callId/media',
      summary: 'Atualizar configurações de mídia',
      description:
        'Atualiza configurações de áudio/vídeo/compartilhamento de tela do participante atual',
    })
    .input(updateParticipantMediaSchema)
    .output(messageResponseSchema),

  getParticipants: prefix
    .route({
      method: 'GET',
      path: '/:callId/participants',
      summary: 'Obter participantes',
      description: 'Obtém todos os participantes de uma chamada',
    })
    .output(callParticipantsResponseSchema),

  sendOffer: prefix
    .route({
      method: 'POST',
      path: '/signaling/offer',
      summary: 'Enviar oferta WebRTC',
      description: 'Envia oferta SDP WebRTC para estabelecer conexão peer-to-peer',
    })
    .input(webRTCOfferSchema)
    .output(webRTCSignalingResponseSchema),

  sendAnswer: prefix
    .route({
      method: 'POST',
      path: '/signaling/answer',
      summary: 'Enviar resposta WebRTC',
      description: 'Envia resposta SDP WebRTC em resposta a uma oferta',
    })
    .input(webRTCAnswerSchema)
    .output(webRTCSignalingResponseSchema),

  sendIceCandidate: prefix
    .route({
      method: 'POST',
      path: '/signaling/ice-candidate',
      summary: 'Enviar candidato ICE',
      description: 'Envia candidato ICE para estabelecimento de conexão WebRTC',
    })
    .input(webRTCIceCandidateSchema)
    .output(webRTCSignalingResponseSchema),

  startRecording: prefix
    .route({
      method: 'POST',
      path: '/:callId/recording/start',
      summary: 'Iniciar gravação',
      description: 'Inicia a gravação de uma chamada',
    })
    .input(startRecordingSchema)
    .output(recordingResponseSchema),

  stopRecording: prefix
    .route({
      method: 'POST',
      path: '/:callId/recording/stop',
      summary: 'Parar gravação',
      description: 'Para a gravação de uma chamada',
    })
    .input(stopRecordingSchema)
    .output(messageResponseSchema),

  getRecordings: prefix
    .route({
      method: 'GET',
      path: '/recordings',
      summary: 'Obter gravações',
      description: 'Obtém gravações de chamadas com paginação',
    })
    .input(callRecordingsQuerySchema)
    .output(recordingsListResponseSchema),

  reportCallQuality: prefix
    .route({
      method: 'POST',
      path: '/:callId/quality',
      summary: 'Relatar qualidade da chamada',
      description: 'Relata problemas e avaliação de uma chamada',
    })
    .input(reportCallQualitySchema)
    .output(messageResponseSchema),

  getCallStatistics: prefix
    .route({
      method: 'GET',
      path: '/:callId/statistics',
      summary: 'Obter estatísticas da chamada',
      description: 'Obtém estatísticas detalhadas de uma chamada',
    })
    .output(callStatisticsResponseSchema),
})
