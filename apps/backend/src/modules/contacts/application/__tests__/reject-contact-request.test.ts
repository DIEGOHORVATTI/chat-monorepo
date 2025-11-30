import type { ContactRequest } from '@contacts/domain/entities/contact-request'
import type { ContactRequestRepository } from '@contacts/domain/repositories/contact-request-repository'

import { it, expect, describe, beforeEach } from 'vitest'
import { notFound, forbidden, badRequest } from '@repo/service-core'

import { makeRejectContactRequest } from '../reject-contact-request'

describe('RejectContactRequest Use Case', () => {
  let contactRequestRepository: ContactRequestRepository
  let rejectContactRequest: ReturnType<typeof makeRejectContactRequest>

  beforeEach(() => {
    contactRequestRepository = {
      findById: async () =>
        ({
          id: 'request-1',
          senderId: 'user-1',
          receiverId: 'user-2',
          status: 'pending',
          message: 'Hi!',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ContactRequest),
      updateStatus: async (id, status) =>
        ({
          id,
          senderId: 'user-1',
          receiverId: 'user-2',
          status,
          message: 'Hi!',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ContactRequest),
    } as ContactRequestRepository

    rejectContactRequest = makeRejectContactRequest(contactRequestRepository)
  })

  it('should reject contact request successfully', async () => {
    await expect(rejectContactRequest('user-2', 'request-1')).resolves.not.toThrow()
  })

  it('should throw error when contact request does not exist', async () => {
    contactRequestRepository.findById = async () => null

    await expect(rejectContactRequest('user-2', 'request-1')).rejects.toThrow(
      notFound('Contact request not found')
    )
  })

  it('should throw error when user is not the receiver', async () => {
    await expect(rejectContactRequest('user-3', 'request-1')).rejects.toThrow(
      forbidden('You cannot reject this contact request')
    )
  })

  it('should throw error when contact request is already accepted', async () => {
    contactRequestRepository.findById = async () =>
      ({
        id: 'request-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'accepted',
      } as ContactRequest)

    await expect(rejectContactRequest('user-2', 'request-1')).rejects.toThrow(
      badRequest('Contact request is not pending')
    )
  })

  it('should throw error when contact request is already rejected', async () => {
    contactRequestRepository.findById = async () =>
      ({
        id: 'request-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'rejected',
      } as ContactRequest)

    await expect(rejectContactRequest('user-2', 'request-1')).rejects.toThrow(
      badRequest('Contact request is not pending')
    )
  })
})
