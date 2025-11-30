import { z } from 'zod'
import { meta, paginationSchema } from '../../shared/base.schema'
import { CallType, CallStatus, ParticipantStatus } from './types'
import type {
  Call,
  CallParticipant,
  InitiateCall,
  AnswerCall,
  EndCall,
  UpdateParticipantMedia,
  AddParticipantsToCall,
  CallRecording,
  StartRecording,
  StopRecording,
  CallRecordingsQuery,
  CallQuery,
  CallHistoryQuery,
  WebRTCOffer,
  WebRTCAnswer,
  WebRTCIceCandidate,
  CallResponse,
  CallsListResponse,
  CallParticipantResponse,
  CallParticipantsResponse,
  WebRTCSignalingResponse,
  RecordingResponse,
  RecordingsListResponse,
} from './types'

const callParticipantSchema = z.object({
  id: z.uuid(),
  callId: z.uuid(),
  userId: z.uuid(),
  userName: z.string(),
  userAvatar: z.url().nullable().optional(),
  status: z.nativeEnum(ParticipantStatus),
  joinedAt: z.date().nullable().optional(),
  leftAt: z.date().nullable().optional(),
  isMuted: z.boolean().default(false),
  isVideoEnabled: z.boolean().default(false),
  isSharingScreen: z.boolean().default(false),
}) satisfies z.ZodType<CallParticipant>

const callSchema = z.object({
  id: z.uuid(),
  chatId: z.uuid().nullable().optional(),
  type: z.nativeEnum(CallType),
  status: z.nativeEnum(CallStatus),
  initiatorId: z.uuid(),
  participants: z.array(callParticipantSchema),
  startedAt: z.date(),
  endedAt: z.date().nullable().optional(),
  duration: z.number().nullable().optional(),
  roomId: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Call>

export const initiateCallSchema = z.object({
  chatId: z.uuid().optional(),
  participantIds: z.array(z.uuid()).min(1),
  type: z.nativeEnum(CallType),
}) satisfies z.ZodType<InitiateCall>

export const answerCallSchema = z.object({
  callId: z.uuid(),
  accept: z.boolean(),
}) satisfies z.ZodType<AnswerCall>

export const endCallSchema = z.object({
  callId: z.uuid(),
}) satisfies z.ZodType<EndCall>

export const updateParticipantMediaSchema = z.object({
  callId: z.uuid(),
  isMuted: z.boolean().optional(),
  isVideoEnabled: z.boolean().optional(),
  isSharingScreen: z.boolean().optional(),
}) satisfies z.ZodType<UpdateParticipantMedia>

export const addParticipantsToCallSchema = z.object({
  callId: z.uuid(),
  participantIds: z.array(z.uuid()).min(1),
}) satisfies z.ZodType<AddParticipantsToCall>

export const callQuerySchema = paginationSchema.extend({
  status: z.nativeEnum(CallStatus).optional(),
  type: z.nativeEnum(CallType).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}) satisfies z.ZodType<CallQuery>

export const callHistoryQuerySchema = paginationSchema.extend({
  chatId: z.uuid().optional(),
  type: z.nativeEnum(CallType).optional(),
}) satisfies z.ZodType<CallHistoryQuery>

export const webRTCOfferSchema = z.object({
  callId: z.uuid(),
  targetUserId: z.uuid(),
  offer: z.object({
    type: z.literal('offer'),
    sdp: z.string(),
  }),
}) satisfies z.ZodType<WebRTCOffer>

export const webRTCAnswerSchema = z.object({
  callId: z.uuid(),
  targetUserId: z.uuid(),
  answer: z.object({
    type: z.literal('answer'),
    sdp: z.string(),
  }),
}) satisfies z.ZodType<WebRTCAnswer>

export const webRTCIceCandidateSchema = z.object({
  callId: z.uuid(),
  targetUserId: z.uuid().optional(),
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable(),
    sdpMLineIndex: z.number().nullable(),
  }),
}) satisfies z.ZodType<WebRTCIceCandidate>

export const callResponseSchema = z.object({
  call: callSchema,
}) satisfies z.ZodType<CallResponse>

export const callsListResponseSchema = z.object({
  calls: z.array(callSchema),
  meta,
}) satisfies z.ZodType<CallsListResponse>

export const callParticipantResponseSchema = z.object({
  participant: callParticipantSchema,
}) satisfies z.ZodType<CallParticipantResponse>

export const callParticipantsResponseSchema = z.object({
  participants: z.array(callParticipantSchema),
}) satisfies z.ZodType<CallParticipantsResponse>

export const webRTCSignalingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
}) satisfies z.ZodType<WebRTCSignalingResponse>

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
}) satisfies z.ZodType<CallRecording>

export const startRecordingSchema = z.object({
  callId: z.uuid(),
}) satisfies z.ZodType<StartRecording>

export const stopRecordingSchema = z.object({
  callId: z.uuid(),
  recordingId: z.uuid(),
}) satisfies z.ZodType<StopRecording>

export const callRecordingsQuerySchema = paginationSchema.extend({
  callId: z.uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}) satisfies z.ZodType<CallRecordingsQuery>

export const recordingResponseSchema = z.object({
  recording: callRecordingSchema,
}) satisfies z.ZodType<RecordingResponse>

export const recordingsListResponseSchema = z.object({
  recordings: z.array(callRecordingSchema),
  meta,
}) satisfies z.ZodType<RecordingsListResponse>
