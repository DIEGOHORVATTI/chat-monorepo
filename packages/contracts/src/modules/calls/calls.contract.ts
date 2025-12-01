import { oc } from '@orpc/contract'

import {
  initiateCallSchema,
  answerCallSchema,
  endCallSchema,
  updateParticipantMediaSchema,
  addParticipantsToCallSchema,
  callQuerySchema,
  callHistoryQuerySchema,
  callResponseSchema,
  callsListResponseSchema,
  callParticipantsResponseSchema,
  webRTCOfferSchema,
  webRTCAnswerSchema,
  webRTCIceCandidateSchema,
  webRTCSignalingResponseSchema,
  startRecordingSchema,
  stopRecordingSchema,
  callRecordingsQuerySchema,
  recordingResponseSchema,
  recordingsListResponseSchema,
  reportCallQualitySchema,
  callStatisticsResponseSchema,
} from './calls.schema'
import { messageResponseSchema } from '../identity/identity.schema'

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
