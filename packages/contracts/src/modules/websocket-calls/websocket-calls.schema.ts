import { z } from 'zod'
import { CallType, CallStatus, ParticipantStatus } from '../calls/types'

export enum CallWebSocketEventType {
  CALL_INITIATE = 'CALL_INITIATE',
  CALL_ANSWER = 'CALL_ANSWER',
  CALL_DECLINE = 'CALL_DECLINE',
  CALL_END = 'CALL_END',
  CALL_PARTICIPANT_MEDIA_UPDATE = 'CALL_PARTICIPANT_MEDIA_UPDATE',

  WEBRTC_OFFER = 'WEBRTC_OFFER',
  WEBRTC_ANSWER = 'WEBRTC_ANSWER',
  WEBRTC_ICE_CANDIDATE = 'WEBRTC_ICE_CANDIDATE',

  CALL_INCOMING = 'CALL_INCOMING',
  CALL_STARTED = 'CALL_STARTED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_PARTICIPANT_JOINED = 'CALL_PARTICIPANT_JOINED',
  CALL_PARTICIPANT_LEFT = 'CALL_PARTICIPANT_LEFT',
  CALL_PARTICIPANT_MEDIA_CHANGED = 'CALL_PARTICIPANT_MEDIA_CHANGED',
  CALL_STATUS_CHANGED = 'CALL_STATUS_CHANGED',

  WEBRTC_OFFER_RECEIVED = 'WEBRTC_OFFER_RECEIVED',
  WEBRTC_ANSWER_RECEIVED = 'WEBRTC_ANSWER_RECEIVED',
  WEBRTC_ICE_CANDIDATE_RECEIVED = 'WEBRTC_ICE_CANDIDATE_RECEIVED',
}

const baseCallEventSchema = z.object({
  event: z.enum(CallWebSocketEventType),
  timestamp: z.date(),
  requestId: z.uuid().optional(),
})

export const callInitiateEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_INITIATE),
  data: z.object({
    chatId: z.uuid().optional(),
    participantIds: z.array(z.uuid()).min(1),
    type: z.enum(CallType),
  }),
})

export const callAnswerEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_ANSWER),
  data: z.object({
    callId: z.uuid(),
  }),
})

export const callDeclineEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_DECLINE),
  data: z.object({
    callId: z.uuid(),
    reason: z.string().optional(),
  }),
})

export const callEndEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_END),
  data: z.object({
    callId: z.uuid(),
  }),
})

export const callParticipantMediaUpdateEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_UPDATE),
  data: z.object({
    callId: z.uuid(),
    isMuted: z.boolean().optional(),
    isVideoEnabled: z.boolean().optional(),
    isSharingScreen: z.boolean().optional(),
  }),
})

export const webRTCOfferEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_OFFER),
  data: z.object({
    callId: z.uuid(),
    targetUserId: z.uuid(),
    offer: z.object({
      type: z.literal('offer'),
      sdp: z.string(),
    }),
  }),
})

export const webRTCAnswerEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ANSWER),
  data: z.object({
    callId: z.uuid(),
    targetUserId: z.uuid(),
    answer: z.object({
      type: z.literal('answer'),
      sdp: z.string(),
    }),
  }),
})

export const webRTCIceCandidateEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ICE_CANDIDATE),
  data: z.object({
    callId: z.uuid(),
    targetUserId: z.uuid().optional(),
    candidate: z.object({
      candidate: z.string(),
      sdpMid: z.string().nullable(),
      sdpMLineIndex: z.number().nullable(),
    }),
  }),
})

export const callIncomingEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_INCOMING),
  data: z.object({
    callId: z.uuid(),
    chatId: z.uuid().nullable().optional(),
    type: z.enum(CallType),
    initiatorId: z.uuid(),
    initiatorName: z.string(),
    initiatorAvatar: z.string().url().nullable().optional(),
    participants: z.array(
      z.object({
        userId: z.uuid(),
        userName: z.string(),
      })
    ),
    roomId: z.string(),
  }),
})

export const callStartedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_STARTED),
  data: z.object({
    callId: z.uuid(),
    roomId: z.string(),
    participants: z.array(
      z.object({
        userId: z.uuid(),
        userName: z.string(),
        userAvatar: z.string().url().nullable().optional(),
        status: z.enum(ParticipantStatus),
      })
    ),
  }),
})

export const callEndedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_ENDED),
  data: z.object({
    callId: z.uuid(),
    duration: z.number(), // in seconds
    endedBy: z.uuid().optional(),
    reason: z.string().optional(),
  }),
})

export const callParticipantJoinedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_PARTICIPANT_JOINED),
  data: z.object({
    callId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    userAvatar: z.string().url().nullable().optional(),
    joinedAt: z.date(),
  }),
})

export const callParticipantLeftEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_PARTICIPANT_LEFT),
  data: z.object({
    callId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    leftAt: z.date(),
    duration: z.number(), // in seconds
  }),
})

export const callParticipantMediaChangedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_PARTICIPANT_MEDIA_CHANGED),
  data: z.object({
    callId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
    isMuted: z.boolean(),
    isVideoEnabled: z.boolean(),
    isSharingScreen: z.boolean(),
  }),
})

export const callStatusChangedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.CALL_STATUS_CHANGED),
  data: z.object({
    callId: z.uuid(),
    status: z.enum(CallStatus),
    changedAt: z.date(),
  }),
})

export const webRTCOfferReceivedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_OFFER_RECEIVED),
  data: z.object({
    callId: z.uuid(),
    fromUserId: z.uuid(),
    fromUserName: z.string(),
    offer: z.object({
      type: z.literal('offer'),
      sdp: z.string(),
    }),
  }),
})

export const webRTCAnswerReceivedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ANSWER_RECEIVED),
  data: z.object({
    callId: z.uuid(),
    fromUserId: z.uuid(),
    fromUserName: z.string(),
    answer: z.object({
      type: z.literal('answer'),
      sdp: z.string(),
    }),
  }),
})

export const webRTCIceCandidateReceivedEventSchema = baseCallEventSchema.extend({
  event: z.literal(CallWebSocketEventType.WEBRTC_ICE_CANDIDATE_RECEIVED),
  data: z.object({
    callId: z.uuid(),
    fromUserId: z.uuid(),
    candidate: z.object({
      candidate: z.string(),
      sdpMid: z.string().nullable(),
      sdpMLineIndex: z.number().nullable(),
    }),
  }),
})

export const callWebSocketEventSchema = z.discriminatedUnion('event', [
  callInitiateEventSchema,
  callAnswerEventSchema,
  callDeclineEventSchema,
  callEndEventSchema,
  callParticipantMediaUpdateEventSchema,
  webRTCOfferEventSchema,
  webRTCAnswerEventSchema,
  webRTCIceCandidateEventSchema,

  callIncomingEventSchema,
  callStartedEventSchema,
  callEndedEventSchema,
  callParticipantJoinedEventSchema,
  callParticipantLeftEventSchema,
  callParticipantMediaChangedEventSchema,
  callStatusChangedEventSchema,
  webRTCOfferReceivedEventSchema,
  webRTCAnswerReceivedEventSchema,
  webRTCIceCandidateReceivedEventSchema,
])

export type CallInitiateEvent = z.infer<typeof callInitiateEventSchema>
export type CallAnswerEvent = z.infer<typeof callAnswerEventSchema>
export type CallDeclineEvent = z.infer<typeof callDeclineEventSchema>
export type CallEndEvent = z.infer<typeof callEndEventSchema>
export type CallParticipantMediaUpdateEvent = z.infer<typeof callParticipantMediaUpdateEventSchema>
export type WebRTCOfferEvent = z.infer<typeof webRTCOfferEventSchema>
export type WebRTCAnswerEvent = z.infer<typeof webRTCAnswerEventSchema>
export type WebRTCIceCandidateEvent = z.infer<typeof webRTCIceCandidateEventSchema>
export type CallIncomingEvent = z.infer<typeof callIncomingEventSchema>
export type CallStartedEvent = z.infer<typeof callStartedEventSchema>
export type CallEndedEvent = z.infer<typeof callEndedEventSchema>
export type CallParticipantJoinedEvent = z.infer<typeof callParticipantJoinedEventSchema>
export type CallParticipantLeftEvent = z.infer<typeof callParticipantLeftEventSchema>
export type CallParticipantMediaChangedEvent = z.infer<
  typeof callParticipantMediaChangedEventSchema
>
export type CallStatusChangedEvent = z.infer<typeof callStatusChangedEventSchema>
export type WebRTCOfferReceivedEvent = z.infer<typeof webRTCOfferReceivedEventSchema>
export type WebRTCAnswerReceivedEvent = z.infer<typeof webRTCAnswerReceivedEventSchema>
export type WebRTCIceCandidateReceivedEvent = z.infer<typeof webRTCIceCandidateReceivedEventSchema>
export type CallWebSocketEvent = z.infer<typeof callWebSocketEventSchema>
