import type { PaginateResult } from '@/utils/paginate'
import type { ContactRequest } from '@contacts/domain/entities/contact-request'
import type { ContactRequestRepository } from '@contacts/domain/repositories/contact-request-repository'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeListContactRequests } from '../list-contact-requests'

describe('ListContactRequests Use Case', () => {
  let contactRequestRepository: ContactRequestRepository
  let listContactRequests: ReturnType<typeof makeListContactRequests>

  beforeEach(() => {
    const mockRequests: ContactRequest[] = [
      {
        id: 'request-1',
        senderId: 'user-2',
        receiverId: 'user-1',
        status: 'pending',
        message: 'Hi, add me!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'request-2',
        senderId: 'user-3',
        receiverId: 'user-1',
        status: 'pending',
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as ContactRequest[]

    contactRequestRepository = {
      findPendingByReceiver: async () =>
        ({
          data: mockRequests,
          meta: {
            total: 2,
            page: 1,
            limit: 10,
            pages: 1,
          },
        } as PaginateResult<ContactRequest>),
    } as ContactRequestRepository

    listContactRequests = makeListContactRequests(contactRequestRepository)
  })

  it('should list pending contact requests with default pagination', async () => {
    const result = await listContactRequests('user-1', 1, 10)

    expect(result.data).toHaveLength(2)
    expect(result.meta.total).toBe(2)
    expect(result.data[0].status).toBe('pending')
  })

  it('should list contact requests with custom page', async () => {
    contactRequestRepository.findPendingByReceiver = async () =>
      ({
        data: [],
        meta: {
          total: 2,
          page: 2,
          limit: 10,
          pages: 1,
        },
      } as PaginateResult<ContactRequest>)

    const result = await listContactRequests('user-1', 2, 10)

    expect(result.data).toHaveLength(0)
    expect(result.meta.page).toBe(2)
  })

  it('should list contact requests with custom limit', async () => {
    contactRequestRepository.findPendingByReceiver = async () =>
      ({
        data: [
          {
            id: 'request-1',
            senderId: 'user-2',
            receiverId: 'user-1',
            status: 'pending',
          },
        ] as ContactRequest[],
        meta: {
          total: 2,
          page: 1,
          limit: 1,
          pages: 2,
        },
      } as PaginateResult<ContactRequest>)

    const result = await listContactRequests('user-1', 1, 1)

    expect(result.data).toHaveLength(1)
    expect(result.meta.limit).toBe(1)
    expect(result.meta.pages).toBe(2)
  })

  it('should return empty list when no pending requests', async () => {
    contactRequestRepository.findPendingByReceiver = async () =>
      ({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      } as PaginateResult<ContactRequest>)

    const result = await listContactRequests('user-999', 1, 10)

    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
  })
})
