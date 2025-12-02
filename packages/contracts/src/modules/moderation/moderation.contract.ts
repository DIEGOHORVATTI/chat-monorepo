import { oc } from '@orpc/contract'
import { z } from 'zod'
import { messageResponseSchema, metaSchema, paginationSchema } from '../../shared/base.schema'
import type {
  Report,
  ReportReason,
  ReportStatus,
  CreateReport,
  MuteChat,
  ArchiveChat,
  BlockUser,
  GetReportsQuery,
  ReportResponse,
  ReportsListResponse,
} from './types'

const reportReasonValues: [ReportReason, ...ReportReason[]] = [
  'spam',
  'harassment',
  'inappropriate_content',
  'hate_speech',
  'violence',
  'impersonation',
  'other',
]

const reportStatusValues: [ReportStatus, ...ReportStatus[]] = [
  'pending',
  'reviewing',
  'resolved',
  'dismissed',
]

const reportSchema = z.object({
  id: z.uuid(),
  reporterId: z.uuid(),
  reportedUserId: z.uuid().optional(),
  reportedMessageId: z.uuid().optional(),
  chatId: z.uuid().optional(),
  reason: z.enum(reportReasonValues),
  description: z.string().optional(),
  status: z.enum(reportStatusValues),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}) satisfies z.ZodType<Report>

export const createReportSchema = z.object({
  reportedUserId: z.uuid().optional(),
  reportedMessageId: z.uuid().optional(),
  chatId: z.uuid().optional(),
  reason: z.enum(reportReasonValues),
  description: z.string().max(500).optional(),
}) satisfies z.ZodType<CreateReport>

export const muteChatSchema = z.object({
  chatId: z.uuid(),
  duration: z.number().positive().optional(),
}) satisfies z.ZodType<MuteChat>

export const archiveChatSchema = z.object({
  chatId: z.uuid(),
}) satisfies z.ZodType<ArchiveChat>

export const blockUserSchema = z.object({
  userId: z.uuid(),
}) satisfies z.ZodType<BlockUser>

export const getReportsQuerySchema = paginationSchema.extend({
  status: z.enum(reportStatusValues).optional(),
}) satisfies z.ZodType<GetReportsQuery>

export const reportResponseSchema = z.object({
  data: reportSchema,
  meta: metaSchema,
}) satisfies z.ZodType<ReportResponse>

export const reportsListResponseSchema = z.object({
  data: z.array(reportSchema),
  meta: metaSchema,
}) satisfies z.ZodType<ReportsListResponse>

const prefix = oc.route({ tags: ['Moderation'] })

export const moderation = oc.prefix('/moderation').router({
  createReport: prefix
    .route({
      method: 'POST',
      path: '/reports',
      summary: 'Criar denúncia',
      description: 'Denuncia um usuário ou mensagem por violação',
    })
    .input(createReportSchema)
    .output(reportResponseSchema),

  getReports: prefix
    .route({
      method: 'GET',
      path: '/reports',
      summary: 'Obter denúncias',
      description: 'Obtém lista paginada de denúncias (apenas admin)',
    })
    .input(getReportsQuerySchema)
    .output(reportsListResponseSchema),

  muteChat: prefix
    .route({
      method: 'POST',
      path: '/mute',
      summary: 'Silenciar chat',
      description: 'Silencia notificações de um chat',
    })
    .input(muteChatSchema)
    .output(messageResponseSchema),

  unmuteChat: prefix
    .route({
      method: 'DELETE',
      path: '/mute/:chatId',
      summary: 'Reativar chat',
      description: 'Reativa notificações de um chat',
    })
    .output(messageResponseSchema),

  archiveChat: prefix
    .route({
      method: 'POST',
      path: '/archive',
      summary: 'Arquivar chat',
      description: 'Arquiva um chat para ocultá-lo da lista ativa',
    })
    .input(archiveChatSchema)
    .output(messageResponseSchema),

  unarchiveChat: prefix
    .route({
      method: 'DELETE',
      path: '/archive/:chatId',
      summary: 'Desarquivar chat',
      description: 'Desarquiva um chat para mostrá-lo na lista ativa',
    })
    .output(messageResponseSchema),

  blockUser: prefix
    .route({
      method: 'POST',
      path: '/block',
      summary: 'Bloquear usuário',
      description: 'Bloqueia um usuário impedindo contato',
    })
    .input(blockUserSchema)
    .output(messageResponseSchema),

  unblockUser: prefix
    .route({
      method: 'DELETE',
      path: '/block/:userId',
      summary: 'Desbloquear usuário',
      description: 'Desbloqueia um usuário previamente bloqueado',
    })
    .output(messageResponseSchema),

  getBlockedUsers: prefix
    .route({
      method: 'GET',
      path: '/blocked',
      summary: 'Obter usuários bloqueados',
      description: 'Obtém lista de usuários bloqueados',
    })
    .output(reportsListResponseSchema),
})
