import { z } from 'zod'
import { metaSchema, paginationSchema } from '../../shared/base.schema'

import { ContactRequestStatus } from './types'

const contactSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  contactId: z.uuid(),
  nickname: z.string().optional(),
  favorite: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const contactRequestSchema = z.object({
  id: z.uuid(),
  senderId: z.uuid(),
  receiverId: z.uuid(),
  status: z.enum(ContactRequestStatus),
  message: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const addContactSchema = z.object({
  userId: z.uuid(),
  message: z.string().max(200).optional(),
})

export const acceptContactRequestSchema = z.object({
  requestId: z.uuid(),
})

export const rejectContactRequestSchema = z.object({
  requestId: z.uuid(),
})

export const updateContactSchema = z.object({
  contactId: z.uuid(),
  nickname: z.string().min(1).max(50).optional(),
  favorite: z.boolean().optional(),
})

export const contactsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  favorites: z.boolean().optional(),
})

export const contactResponseSchema = z.object({
  data: contactSchema,
  meta: metaSchema,
})

export const contactRequestResponseSchema = z.object({
  data: contactRequestSchema,
  meta: metaSchema,
})

export const contactsListResponseSchema = z.object({
  data: z.array(contactSchema),
  meta: metaSchema,
})

export const contactRequestsListResponseSchema = z.object({
  data: z.array(contactRequestSchema),
  meta: metaSchema,
})

export const messageResponseSchema = z.object({
  message: z.string(),
  meta: metaSchema,
})
