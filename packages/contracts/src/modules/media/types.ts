import type { Meta } from '../../shared/types'

export interface MediaFile {
  id: string
  name: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  uploadedAt: Date
  chatId?: string
  messageId?: string
}

export interface UploadFile {
  name: string
  mimeType: string
  size: number
  chatId?: string
}

export interface GenerateThumbnail {
  fileId: string
  width?: number
  height?: number
}

export interface MediaFileResponse {
  data: MediaFile
  meta: Meta
}

export interface MediaFilesListResponse {
  data: MediaFile[]
  meta: Meta
}
