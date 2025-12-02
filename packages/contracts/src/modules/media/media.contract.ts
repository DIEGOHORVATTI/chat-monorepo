import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../../shared/base.schema'
import {
  uploadFileSchema,
  generateThumbnailSchema,
  mediaFileResponseSchema,
  mediaFilesListResponseSchema,
} from './media.schema'

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
