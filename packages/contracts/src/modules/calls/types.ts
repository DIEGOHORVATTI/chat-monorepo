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
  data: Call
  meta: Meta
}

export interface CallsListResponse {
  data: Call[]
  meta: Meta
}

export interface CallParticipantResponse {
  data: CallParticipant
  meta: Meta
}

export interface CallParticipantsResponse {
  data: CallParticipant[]
  meta: Meta
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
  data: CallRecording
  meta: Meta
}

export interface RecordingsListResponse {
  data: CallRecording[]
  meta: Meta
}

export enum CallQualityIssue {
  POOR_CONNECTION = 'poor_connection',
  AUDIO_ISSUES = 'audio_issues',
  VIDEO_ISSUES = 'video_issues',
  ECHO = 'echo',
  DROPPED_CALL = 'dropped_call',
  OTHER = 'other',
}

export interface ReportCallQuality {
  callId: string
  rating: number
  issues?: CallQualityIssue[]
  feedback?: string
}

export interface CallStatistics {
  callId: string
  duration: number
  audioLatency: number
  videoLatency: number
  packetLoss: number
  jitter: number
  bitrate: number
}

export interface CallStatisticsResponse {
  data: CallStatistics
  meta: Meta
}
