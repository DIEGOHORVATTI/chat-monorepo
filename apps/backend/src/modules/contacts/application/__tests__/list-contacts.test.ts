import type { PaginateResult } from '@/utils/paginate'
import type { Contact } from '@contacts/domain/entities/contact'
import type { ContactRepository } from '@contacts/domain/repositories/contact-repository'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeListContacts } from '../list-contacts'

describe('ListContacts Use Case', () => {
  let contactRepository: ContactRepository
  let listContacts: ReturnType<typeof makeListContacts>

  beforeEach(() => {
    const mockContacts: Contact[] = [
      {
        id: 'contact-1',
        userId: 'user-1',
        contactId: 'user-2',
        nickname: 'Friend 1',
        favorite: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'contact-2',
        userId: 'user-1',
        contactId: 'user-3',
        nickname: null,
        favorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as Contact[]

    contactRepository = {
      findAllByUserId: async () =>
        ({
          data: mockContacts,
          meta: {
            total: 2,
            page: 1,
            limit: 10,
            pages: 1,
          },
        } as PaginateResult<Contact>),
    } as ContactRepository

    listContacts = makeListContacts(contactRepository)
  })

  it('should list contacts with default pagination', async () => {
    const result = await listContacts('user-1', 1, 10)

    expect(result.data).toHaveLength(2)
    expect(result.meta.total).toBe(2)
    expect(result.meta.page).toBe(1)
    expect(result.meta.limit).toBe(10)
  })

  it('should list contacts with custom page', async () => {
    contactRepository.findAllByUserId = async () =>
      ({
        data: [],
        meta: {
          total: 2,
          page: 2,
          limit: 10,
          pages: 1,
        },
      } as PaginateResult<Contact>)

    const result = await listContacts('user-1', 2, 10)

    expect(result.data).toHaveLength(0)
    expect(result.meta.page).toBe(2)
  })

  it('should list contacts with custom limit', async () => {
    contactRepository.findAllByUserId = async () =>
      ({
        data: [
          {
            id: 'contact-1',
            userId: 'user-1',
            contactId: 'user-2',
          },
        ] as Contact[],
        meta: {
          total: 2,
          page: 1,
          limit: 1,
          pages: 2,
        },
      } as PaginateResult<Contact>)

    const result = await listContacts('user-1', 1, 1)

    expect(result.data).toHaveLength(1)
    expect(result.meta.limit).toBe(1)
    expect(result.meta.pages).toBe(2)
  })

  it('should return empty list for user with no contacts', async () => {
    contactRepository.findAllByUserId = async () =>
      ({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      } as PaginateResult<Contact>)

    const result = await listContacts('user-999', 1, 10)

    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
  })
})
