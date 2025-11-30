import { z } from 'zod'
import { metaSchema, paginationSchema } from '../../shared/base.schema'
import type {
  Contact,
  ContactRequest,
  ContactRequestStatus,
  AddContact,
  AcceptContactRequest,
  RejectContactRequest,
  RemoveContact,
  UpdateContact,
  ContactsQuery,
  ContactResponse,
  ContactRequestResponse,
  ContactsListResponse,
  ContactRequestsListResponse,
} from './types'
import { ContactRequestStatus as ContactRequestStatusEnum } from './types'

const contactSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  contactId: z.string().uuid(),
  nickname: z.string().optional(),
  favorite: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}) satisfies z.ZodType<Contact>

const contactRequestSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  status: z.nativeEnum(ContactRequestStatusEnum),
  message: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}) satisfies z.ZodType<ContactRequest>

export const addContactSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().max(200).optional(),
}) satisfies z.ZodType<AddContact>

export const acceptContactRequestSchema = z.object({
  requestId: z.string().uuid(),
}) satisfies z.ZodType<AcceptContactRequest>

export const rejectContactRequestSchema = z.object({
  requestId: z.string().uuid(),
}) satisfies z.ZodType<RejectContactRequest>

export const removeContactSchema = z.object({
  contactId: z.string().uuid(),
}) satisfies z.ZodType<RemoveContact>

export const updateContactSchema = z.object({
  contactId: z.string().uuid(),
  nickname: z.string().min(1).max(50).optional(),
  favorite: z.boolean().optional(),
}) satisfies z.ZodType<UpdateContact>

export const contactsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  favorites: z.boolean().optional(),
}) satisfies z.ZodType<ContactsQuery>

export const contactResponseSchema = z.object({
  data: contactSchema,
  meta: metaSchema,
}) satisfies z.ZodType<ContactResponse>

export const contactRequestResponseSchema = z.object({
  data: contactRequestSchema,
  meta: metaSchema,
}) satisfies z.ZodType<ContactRequestResponse>

export const contactsListResponseSchema = z.object({
  data: z.array(contactSchema),
  meta: metaSchema,
}) satisfies z.ZodType<ContactsListResponse>

export const contactRequestsListResponseSchema = z.object({
  data: z.array(contactRequestSchema),
  meta: metaSchema,
}) satisfies z.ZodType<ContactRequestsListResponse>
