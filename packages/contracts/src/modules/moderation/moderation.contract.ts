import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../identity/identity.schema'
import {
  createReportSchema,
  muteChatSchema,
  archiveChatSchema,
  blockUserSchema,
  getReportsQuerySchema,
  reportResponseSchema,
  reportsListResponseSchema,
} from './moderation.schema'

const prefix = oc.route({ tags: ['Moderation'] })

export const moderation = oc.prefix('/moderation').router({
  createReport: prefix
    .route({
      method: 'POST',
      path: '/reports',
      summary: 'Create report',
      description: 'Report a user or message for violation',
    })
    .input(createReportSchema)
    .output(reportResponseSchema),

  getReports: prefix
    .route({
      method: 'GET',
      path: '/reports',
      summary: 'Get reports',
      description: 'Get paginated list of reports (admin only)',
    })
    .input(getReportsQuerySchema)
    .output(reportsListResponseSchema),

  muteChat: prefix
    .route({
      method: 'POST',
      path: '/mute',
      summary: 'Mute chat',
      description: 'Mute notifications for a chat',
    })
    .input(muteChatSchema)
    .output(messageResponseSchema),

  unmuteChat: prefix
    .route({
      method: 'DELETE',
      path: '/mute/:chatId',
      summary: 'Unmute chat',
      description: 'Unmute notifications for a chat',
    })
    .output(messageResponseSchema),

  archiveChat: prefix
    .route({
      method: 'POST',
      path: '/archive',
      summary: 'Archive chat',
      description: 'Archive a chat to hide it from active list',
    })
    .input(archiveChatSchema)
    .output(messageResponseSchema),

  unarchiveChat: prefix
    .route({
      method: 'DELETE',
      path: '/archive/:chatId',
      summary: 'Unarchive chat',
      description: 'Unarchive a chat to show it in active list',
    })
    .output(messageResponseSchema),

  blockUser: prefix
    .route({
      method: 'POST',
      path: '/block',
      summary: 'Block user',
      description: 'Block a user from contacting you',
    })
    .input(blockUserSchema)
    .output(messageResponseSchema),

  unblockUser: prefix
    .route({
      method: 'DELETE',
      path: '/block/:userId',
      summary: 'Unblock user',
      description: 'Unblock a previously blocked user',
    })
    .output(messageResponseSchema),

  getBlockedUsers: prefix
    .route({
      method: 'GET',
      path: '/blocked',
      summary: 'Get blocked users',
      description: 'Get list of blocked users',
    })
    .output(reportsListResponseSchema),
})
