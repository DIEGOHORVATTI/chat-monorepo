import { oc } from '@orpc/contract'
import { z } from 'zod'
import { messageResponseSchema, metaSchema } from '../../shared/base.schema'
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

const prefix = oc.route({ tags: ['Media'] })

export const media = oc.prefix('/media').router({
  uploadFile: prefix
    .route({
      method: 'POST',
      path: '/upload',
      summary: 'Fazer upload de arquivo',
      description: 'Faz upload de um arquivo de mídia (imagem, vídeo, áudio, documento)',
    })
    .input(uploadFileSchema)
    .output(mediaFileResponseSchema),

  getFile: prefix
    .route({
      method: 'GET',
      path: '/:fileId',
      summary: 'Obter arquivo',
      description: 'Obtém um arquivo específico pelo ID',
    })
    .output(mediaFileResponseSchema),

  deleteFile: prefix
    .route({
      method: 'DELETE',
      path: '/:fileId',
      summary: 'Excluir arquivo',
      description: 'Exclui um arquivo de mídia',
    })
    .output(messageResponseSchema),

  generateThumbnail: prefix
    .route({
      method: 'POST',
      path: '/:fileId/thumbnail',
      summary: 'Gerar miniatura',
      description: 'Gera miniatura para um arquivo de imagem ou vídeo',
    })
    .input(generateThumbnailSchema)
    .output(mediaFileResponseSchema),

  getChatMedia: prefix
    .route({
      method: 'GET',
      path: '/chat/:chatId',
      summary: 'Obter mídias do chat',
      description: 'Obtém todos os arquivos de mídia de um chat específico',
    })
    .output(mediaFilesListResponseSchema),
})
