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
} from './calls.schema'
import { messageResponseSchema } from '../identity/identity.schema'

const prefix = oc.route({ tags: ['Calls'] })

export const calls = oc.prefix('/calls').router({
  // Call Management
  initiateCall: prefix
    .route({
      method: 'POST',
      path: '/',
      summary: 'Initiate call',
      description: 'Start a new audio or video call with one or more participants',
    })
    .input(initiateCallSchema)
    .output(callResponseSchema),

  answerCall: prefix
    .route({
      method: 'POST',
      path: '/:callId/answer',
      summary: 'Answer call',
      description: 'Accept or decline an incoming call',
    })
    .input(answerCallSchema)
    .output(callResponseSchema),

  endCall: prefix
    .route({
      method: 'POST',
      path: '/:callId/end',
      summary: 'End call',
      description: 'End an active call',
    })
    .input(endCallSchema)
    .output(messageResponseSchema),

  getCall: prefix
    .route({
      method: 'GET',
      path: '/:callId',
      summary: 'Get call',
      description: 'Get details of a specific call',
    })
    .output(callResponseSchema),

  listActiveCalls: prefix
    .route({
      method: 'GET',
      path: '/active',
      summary: 'List active calls',
      description: 'List all active calls for the current user',
    })
    .input(callQuerySchema)
    .output(callsListResponseSchema),

  getCallHistory: prefix
    .route({
      method: 'GET',
      path: '/history',
      summary: 'Get call history',
      description: 'Get call history with pagination',
    })
    .input(callHistoryQuerySchema)
    .output(callsListResponseSchema),

  // Participant Management
  addParticipants: prefix
    .route({
      method: 'POST',
      path: '/:callId/participants',
      summary: 'Add participants',
      description: 'Add more participants to an ongoing call',
    })
    .input(addParticipantsToCallSchema)
    .output(callParticipantsResponseSchema),

  updateMedia: prefix
    .route({
      method: 'PATCH',
      path: '/:callId/media',
      summary: 'Update media settings',
      description: 'Update audio/video/screen sharing settings for the current participant',
    })
    .input(updateParticipantMediaSchema)
    .output(messageResponseSchema),

  getParticipants: prefix
    .route({
      method: 'GET',
      path: '/:callId/participants',
      summary: 'Get participants',
      description: 'Get all participants in a call',
    })
    .output(callParticipantsResponseSchema),

  // WebRTC Signaling
  sendOffer: prefix
    .route({
      method: 'POST',
      path: '/signaling/offer',
      summary: 'Send WebRTC offer',
      description: 'Send WebRTC offer SDP to establish peer connection',
    })
    .input(webRTCOfferSchema)
    .output(webRTCSignalingResponseSchema),

  sendAnswer: prefix
    .route({
      method: 'POST',
      path: '/signaling/answer',
      summary: 'Send WebRTC answer',
      description: 'Send WebRTC answer SDP in response to an offer',
    })
    .input(webRTCAnswerSchema)
    .output(webRTCSignalingResponseSchema),

  sendIceCandidate: prefix
    .route({
      method: 'POST',
      path: '/signaling/ice-candidate',
      summary: 'Send ICE candidate',
      description: 'Send ICE candidate for WebRTC connection establishment',
    })
    .input(webRTCIceCandidateSchema)
    .output(webRTCSignalingResponseSchema),
})
