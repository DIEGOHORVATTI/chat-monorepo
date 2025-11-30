import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../identity/identity.schema'
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
      summary: 'Upload file',
      description: 'Upload a media file (image, video, audio, document)',
    })
    .input(uploadFileSchema)
    .output(mediaFileResponseSchema),

  getFile: prefix
    .route({
      method: 'GET',
      path: '/:fileId',
      summary: 'Get file',
      description: 'Get a specific file by ID',
    })
    .output(mediaFileResponseSchema),

  deleteFile: prefix
    .route({
      method: 'DELETE',
      path: '/:fileId',
      summary: 'Delete file',
      description: 'Delete a media file',
    })
    .output(messageResponseSchema),

  generateThumbnail: prefix
    .route({
      method: 'POST',
      path: '/:fileId/thumbnail',
      summary: 'Generate thumbnail',
      description: 'Generate thumbnail for an image or video file',
    })
    .input(generateThumbnailSchema)
    .output(mediaFileResponseSchema),

  getChatMedia: prefix
    .route({
      method: 'GET',
      path: '/chat/:chatId',
      summary: 'Get chat media',
      description: 'Get all media files for a specific chat',
    })
    .output(mediaFilesListResponseSchema),
})
