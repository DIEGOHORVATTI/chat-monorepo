import type { PaginateResult } from '@/utils/paginate'
import type { ContactRequest } from '@contacts/domain/entities/contact-request'
import type { ContactRequestRepository } from '@contacts/domain/repositories/contact-request-repository'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeListSentRequests } from '../list-sent-requests'

describe('ListSentRequests Use Case', () => {
  let contactRequestRepository: ContactRequestRepository
  let listSentRequests: ReturnType<typeof makeListSentRequests>

  beforeEach(() => {
    const mockRequests: ContactRequest[] = [
      {
        id: 'request-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'pending',
        message: 'Hi!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'request-2',
        senderId: 'user-1',
        receiverId: 'user-3',
        status: 'accepted',
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'request-3',
        senderId: 'user-1',
        receiverId: 'user-4',
        status: 'rejected',
        message: 'Want to connect',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as ContactRequest[]

    contactRequestRepository = {
      findBySender: async () =>
        ({
          data: mockRequests,
          meta: {
            total: 3,
            page: 1,
            limit: 10,
            pages: 1,
          },
        } as PaginateResult<ContactRequest>),
    } as ContactRequestRepository

    listSentRequests = makeListSentRequests(contactRequestRepository)
  })

  it('should list sent requests with all statuses', async () => {
    const result = await listSentRequests('user-1', 1, 10)

    expect(result.data).toHaveLength(3)
    expect(result.meta.total).toBe(3)
    expect(result.data.map((r) => r.status)).toContain('pending')
    expect(result.data.map((r) => r.status)).toContain('accepted')
    expect(result.data.map((r) => r.status)).toContain('rejected')
  })

  it('should list sent requests with custom page', async () => {
    contactRequestRepository.findBySender = async () =>
      ({
        data: [],
        meta: {
          total: 3,
          page: 2,
          limit: 10,
          pages: 1,
        },
      } as PaginateResult<ContactRequest>)

    const result = await listSentRequests('user-1', 2, 10)

    expect(result.data).toHaveLength(0)
    expect(result.meta.page).toBe(2)
  })

  it('should list sent requests with custom limit', async () => {
    contactRequestRepository.findBySender = async () =>
      ({
        data: [
          {
            id: 'request-1',
            senderId: 'user-1',
            receiverId: 'user-2',
            status: 'pending',
          },
        ] as ContactRequest[],
        meta: {
          total: 3,
          page: 1,
          limit: 1,
          pages: 3,
        },
      } as PaginateResult<ContactRequest>)

    const result = await listSentRequests('user-1', 1, 1)

    expect(result.data).toHaveLength(1)
    expect(result.meta.limit).toBe(1)
    expect(result.meta.pages).toBe(3)
  })

  it('should return empty list when no sent requests', async () => {
    contactRequestRepository.findBySender = async () =>
      ({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      } as PaginateResult<ContactRequest>)

    const result = await listSentRequests('user-999', 1, 10)

    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
  })
})
