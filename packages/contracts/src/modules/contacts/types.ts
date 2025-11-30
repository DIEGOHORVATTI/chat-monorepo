import type { Meta, PaginationQuery } from '../../shared/types'

export enum ContactRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Contact {
  id: string
  userId: string
  contactId: string
  nickname?: string
  favorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ContactRequest {
  id: string
  senderId: string
  receiverId: string
  status: ContactRequestStatus
  message?: string
  createdAt: Date
  updatedAt: Date
}

export interface AddContact {
  userId: string
  message?: string
}

export interface AcceptContactRequest {
  requestId: string
}

export interface RejectContactRequest {
  requestId: string
}

export interface RemoveContact {
  contactId: string
}

export interface UpdateContact {
  contactId: string
  nickname?: string
  favorite?: boolean
}

export interface ContactsQuery extends PaginationQuery {
  search?: string
  favorites?: boolean
}

export interface ContactResponse {
  data: Contact
  meta: Meta
}

export interface ContactRequestResponse {
  data: ContactRequest
  meta: Meta
}

export interface ContactsListResponse {
  data: Contact[]
  meta: Meta
}

export interface ContactRequestsListResponse {
  data: ContactRequest[]
  meta: Meta
}
