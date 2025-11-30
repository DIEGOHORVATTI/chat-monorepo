import type { PaginateResult } from '@/utils/paginate'

import type { ContactRequest, ContactRequestStatus } from '../entities'

export type PaginatedContactRequests = PaginateResult<ContactRequest>

export type ContactRequestRepository = {
  findById(id: string): Promise<ContactRequest | null>
  findByUsers(senderId: string, receiverId: string): Promise<ContactRequest | null>
  findPendingByReceiver(
    receiverId: string,
    page: number,
    limit: number
  ): Promise<PaginatedContactRequests>
  findBySender(senderId: string, page: number, limit: number): Promise<PaginatedContactRequests>
  save(contactRequest: ContactRequest): Promise<void>
  updateStatus(id: string, status: ContactRequestStatus): Promise<void>
}
