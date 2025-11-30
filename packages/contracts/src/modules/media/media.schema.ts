import { z } from 'zod'
import { metaSchema } from '../../shared/base.schema'
import type {
  MediaFile,
  UploadFile,
  GenerateThumbnail,
  MediaFileResponse,
  MediaFilesListResponse,
} from './types'

const mediaFileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number().positive(),
  url: z.url(),
  thumbnailUrl: z.url().optional(),
  uploadedBy: z.uuid(),
  uploadedAt: z.coerce.date(),
  chatId: z.uuid().optional(),
  messageId: z.uuid().optional(),
}) satisfies z.ZodType<MediaFile>

export const uploadFileSchema = z.object({
  name: z.string().min(1).max(255),
  mimeType: z.string(),
  size: z
    .number()
    .positive()
    .max(100 * 1024 * 1024),
  chatId: z.uuid().optional(),
}) satisfies z.ZodType<UploadFile>

export const generateThumbnailSchema = z.object({
  fileId: z.uuid(),
  width: z.number().positive().max(1920).optional(),
  height: z.number().positive().max(1920).optional(),
}) satisfies z.ZodType<GenerateThumbnail>

export const mediaFileResponseSchema = z.object({
  data: mediaFileSchema,
  meta: metaSchema,
}) satisfies z.ZodType<MediaFileResponse>

export const mediaFilesListResponseSchema = z.object({
  data: z.array(mediaFileSchema),
  meta: metaSchema,
}) satisfies z.ZodType<MediaFilesListResponse>
