import { z } from 'zod'
import { metaSchema, paginationSchema } from '../../shared/base.schema'
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
  id: z.string().uuid(),
  reporterId: z.string().uuid(),
  reportedUserId: z.string().uuid().optional(),
  reportedMessageId: z.string().uuid().optional(),
  chatId: z.string().uuid().optional(),
  reason: z.enum(reportReasonValues),
  description: z.string().optional(),
  status: z.enum(reportStatusValues),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}) satisfies z.ZodType<Report>

export const createReportSchema = z.object({
  reportedUserId: z.string().uuid().optional(),
  reportedMessageId: z.string().uuid().optional(),
  chatId: z.string().uuid().optional(),
  reason: z.enum(reportReasonValues),
  description: z.string().max(500).optional(),
}) satisfies z.ZodType<CreateReport>

export const muteChatSchema = z.object({
  chatId: z.string().uuid(),
  duration: z.number().positive().optional(),
}) satisfies z.ZodType<MuteChat>

export const archiveChatSchema = z.object({
  chatId: z.string().uuid(),
}) satisfies z.ZodType<ArchiveChat>

export const blockUserSchema = z.object({
  userId: z.string().uuid(),
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
