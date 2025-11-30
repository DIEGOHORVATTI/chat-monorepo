import { z } from 'zod'
import { meta, paginationSchema } from './base'

export enum CallType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum CallStatus {
  RINGING = 'RINGING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ENDED = 'ENDED',
  MISSED = 'MISSED',
  DECLINED = 'DECLINED',
  FAILED = 'FAILED',
  BUSY = 'BUSY',
}

export enum ParticipantStatus {
  INVITED = 'INVITED',
  RINGING = 'RINGING',
  JOINED = 'JOINED',
  LEFT = 'LEFT',
  DECLINED = 'DECLINED',
  MISSED = 'MISSED',
}

const callParticipantSchema = z.object({
  id: z.string().uuid(),
  callId: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string(),
  userAvatar: z.string().url().nullable().optional(),
  status: z.nativeEnum(ParticipantStatus),
  joinedAt: z.date().nullable().optional(),
  leftAt: z.date().nullable().optional(),
  isMuted: z.boolean().default(false),
  isVideoEnabled: z.boolean().default(false),
  isSharingScreen: z.boolean().default(false),
})

const callSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid().nullable().optional(),
  type: z.nativeEnum(CallType),
  status: z.nativeEnum(CallStatus),
  initiatorId: z.string().uuid(),
  participants: z.array(callParticipantSchema),
  startedAt: z.date(),
  endedAt: z.date().nullable().optional(),
  duration: z.number().nullable().optional(), // in seconds
  roomId: z.string(), // WebRTC room identifier
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Input Schemas
export const initiateCallSchema = z.object({
  chatId: z.string().uuid().optional(),
  participantIds: z.array(z.string().uuid()).min(1),
  type: z.nativeEnum(CallType),
})

export const answerCallSchema = z.object({
  callId: z.string().uuid(),
  accept: z.boolean(),
})

export const endCallSchema = z.object({
  callId: z.string().uuid(),
})

export const updateParticipantMediaSchema = z.object({
  callId: z.string().uuid(),
  isMuted: z.boolean().optional(),
  isVideoEnabled: z.boolean().optional(),
  isSharingScreen: z.boolean().optional(),
})

export const addParticipantsToCallSchema = z.object({
  callId: z.string().uuid(),
  participantIds: z.array(z.string().uuid()).min(1),
})

export const callQuerySchema = paginationSchema.extend({
  status: z.nativeEnum(CallStatus).optional(),
  type: z.nativeEnum(CallType).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export const callHistoryQuerySchema = paginationSchema.extend({
  chatId: z.string().uuid().optional(),
  type: z.nativeEnum(CallType).optional(),
})

// WebRTC Signaling Schemas
export const webRTCOfferSchema = z.object({
  callId: z.string().uuid(),
  targetUserId: z.string().uuid(),
  offer: z.object({
    type: z.literal('offer'),
    sdp: z.string(),
  }),
})

export const webRTCAnswerSchema = z.object({
  callId: z.string().uuid(),
  targetUserId: z.string().uuid(),
  answer: z.object({
    type: z.literal('answer'),
    sdp: z.string(),
  }),
})

export const webRTCIceCandidateSchema = z.object({
  callId: z.string().uuid(),
  targetUserId: z.string().uuid().optional(),
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable(),
    sdpMLineIndex: z.number().nullable(),
  }),
})

// Response Schemas
export const callResponseSchema = z.object({
  call: callSchema,
})

export const callsListResponseSchema = z.object({
  calls: z.array(callSchema),
  meta,
})

export const callParticipantResponseSchema = z.object({
  participant: callParticipantSchema,
})

export const callParticipantsResponseSchema = z.object({
  participants: z.array(callParticipantSchema),
})

export const webRTCSignalingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// Type exports
export type Call = z.infer<typeof callSchema>
export type CallParticipant = z.infer<typeof callParticipantSchema>
export type InitiateCall = z.infer<typeof initiateCallSchema>
export type AnswerCall = z.infer<typeof answerCallSchema>
export type EndCall = z.infer<typeof endCallSchema>
export type UpdateParticipantMedia = z.infer<typeof updateParticipantMediaSchema>
export type AddParticipantsToCall = z.infer<typeof addParticipantsToCallSchema>
export type CallQuery = z.infer<typeof callQuerySchema>
export type CallHistoryQuery = z.infer<typeof callHistoryQuerySchema>
export type WebRTCOffer = z.infer<typeof webRTCOfferSchema>
export type WebRTCAnswer = z.infer<typeof webRTCAnswerSchema>
export type WebRTCIceCandidate = z.infer<typeof webRTCIceCandidateSchema>
export type CallResponse = z.infer<typeof callResponseSchema>
export type CallsListResponse = z.infer<typeof callsListResponseSchema>
export type CallParticipantResponse = z.infer<typeof callParticipantResponseSchema>
export type CallParticipantsResponse = z.infer<typeof callParticipantsResponseSchema>
export type WebRTCSignalingResponse = z.infer<typeof webRTCSignalingResponseSchema>
