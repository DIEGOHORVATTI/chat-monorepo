import type { PaginateResult } from '@/utils/paginate'

import type { Contact } from '../entities'

export type PaginatedContacts = PaginateResult<Contact>

export type ContactRepository = {
  findById(id: string): Promise<Contact | null>
  findByUserAndContact(userId: string, contactId: string): Promise<Contact | null>
  findAllByUserId(userId: string, page: number, limit: number): Promise<PaginatedContacts>
  save(contact: Contact): Promise<void>
  delete(id: string): Promise<void>
}
