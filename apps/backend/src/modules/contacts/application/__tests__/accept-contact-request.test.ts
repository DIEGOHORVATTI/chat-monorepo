import type { Contact } from '@contacts/domain/entities/contact'
import type { ContactRequest } from '@contacts/domain/entities/contact-request'
import type { ContactRepository } from '@contacts/domain/repositories/contact-repository'
import type { ContactRequestRepository } from '@contacts/domain/repositories/contact-request-repository'

import { it, expect, describe, beforeEach } from 'vitest'
import { notFound, forbidden, badRequest } from '@repo/service-core'

import { makeAcceptContactRequest } from '../accept-contact-request'

describe('AcceptContactRequest Use Case', () => {
  let contactRepository: ContactRepository
  let contactRequestRepository: ContactRequestRepository
  let acceptContactRequest: ReturnType<typeof makeAcceptContactRequest>

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

    contactRepository = {
      save: async (contact) => contact as Contact,
    } as ContactRepository

    acceptContactRequest = makeAcceptContactRequest(contactRepository, contactRequestRepository)
  })

  it('should accept contact request and create bidirectional contacts', async () => {
    const result = await acceptContactRequest('user-2', 'request-1')

    expect(result.userId).toBe('user-2')
    expect(result.contactId).toBe('user-1')
  })

  it('should throw error when contact request does not exist', async () => {
    contactRequestRepository.findById = async () => null

    await expect(acceptContactRequest('user-2', 'request-1')).rejects.toThrow(
      notFound('Contact request not found')
    )
  })

  it('should throw error when user is not the receiver', async () => {
    await expect(acceptContactRequest('user-3', 'request-1')).rejects.toThrow(
      forbidden('You cannot accept this contact request')
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

    await expect(acceptContactRequest('user-2', 'request-1')).rejects.toThrow(
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

    await expect(acceptContactRequest('user-2', 'request-1')).rejects.toThrow(
      badRequest('Contact request is not pending')
    )
  })
})
