import type { Meta, PaginationQuery } from '../../shared/types'

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'hate_speech'
  | 'violence'
  | 'impersonation'
  | 'other'

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed'

export interface Report {
  id: string
  reporterId: string
  reportedUserId?: string
  reportedMessageId?: string
  chatId?: string
  reason: ReportReason
  description?: string
  status: ReportStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateReport {
  reportedUserId?: string
  reportedMessageId?: string
  chatId?: string
  reason: ReportReason
  description?: string
}

export interface MuteChat {
  chatId: string
  duration?: number
}

export interface ArchiveChat {
  chatId: string
}

export interface BlockUser {
  userId: string
}

export interface GetReportsQuery extends PaginationQuery {
  status?: ReportStatus
}

export interface ReportResponse {
  data: Report
  meta: Meta
}

export interface ReportsListResponse {
  data: Report[]
  meta: Meta
}
