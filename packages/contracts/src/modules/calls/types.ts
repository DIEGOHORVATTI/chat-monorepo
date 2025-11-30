import type { Meta, PaginationQuery } from '../../shared/types'

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

export interface CallParticipant {
  id: string
  callId: string
  userId: string
  userName: string
  userAvatar?: string | null
  status: ParticipantStatus
  joinedAt?: Date | null
  leftAt?: Date | null
  isMuted: boolean
  isVideoEnabled: boolean
  isSharingScreen: boolean
}

export interface Call {
  id: string
  chatId?: string | null
  type: CallType
  status: CallStatus
  initiatorId: string
  participants: CallParticipant[]
  startedAt: Date
  endedAt?: Date | null
  duration?: number | null
  roomId: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface InitiateCall {
  chatId?: string
  participantIds: string[]
  type: CallType
}

export interface AnswerCall {
  callId: string
  accept: boolean
}

export interface EndCall {
  callId: string
}

export interface UpdateParticipantMedia {
  callId: string
  isMuted?: boolean
  isVideoEnabled?: boolean
  isSharingScreen?: boolean
}

export interface AddParticipantsToCall {
  callId: string
  participantIds: string[]
}

export interface CallQuery extends PaginationQuery {
  status?: CallStatus
  type?: CallType
  startDate?: Date
  endDate?: Date
}

export interface CallHistoryQuery extends PaginationQuery {
  chatId?: string
  type?: CallType
}

export interface WebRTCOffer {
  callId: string
  targetUserId: string
  offer: {
    type: 'offer'
    sdp: string
  }
}

export interface WebRTCAnswer {
  callId: string
  targetUserId: string
  answer: {
    type: 'answer'
    sdp: string
  }
}

export interface WebRTCIceCandidate {
  callId: string
  targetUserId?: string
  candidate: {
    candidate: string
    sdpMid: string | null
    sdpMLineIndex: number | null
  }
}

export interface CallResponse {
  call: Call
}

export interface CallsListResponse {
  calls: Call[]
  meta: Meta
}

export interface CallParticipantResponse {
  participant: CallParticipant
}

export interface CallParticipantsResponse {
  participants: CallParticipant[]
}

export interface WebRTCSignalingResponse {
  success: boolean
  message?: string
}

export interface CallRecording {
  id: string
  callId: string
  startedAt: Date
  endedAt?: Date | null
  duration?: number | null
  fileUrl?: string | null
  fileSize?: number | null
  status: 'recording' | 'processing' | 'completed' | 'failed'
  createdAt: Date
}

export interface StartRecording {
  callId: string
}

export interface StopRecording {
  callId: string
  recordingId: string
}

export interface CallRecordingsQuery extends PaginationQuery {
  callId?: string
  startDate?: Date
  endDate?: Date
}

export interface RecordingResponse {
  recording: CallRecording
}

export interface RecordingsListResponse {
  recordings: CallRecording[]
  meta: Meta
}
