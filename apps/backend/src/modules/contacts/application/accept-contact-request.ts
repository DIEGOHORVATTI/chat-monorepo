import type { ContactRepository, ContactRequestRepository } from '@contacts/domain/repositories'

import { notFound, forbidden, badRequest } from '@repo/service-core'
import { createContact, ContactRequestStatus } from '@contacts/domain/entities'

export const makeAcceptContactRequest =
  (contactRepository: ContactRepository, contactRequestRepository: ContactRequestRepository) =>
  async (currentUserId: string, requestId: string) => {
    const request = await contactRequestRepository.findById(requestId)

    if (!request) {
      throw notFound('Contact request not found')
    }

    if (request.receiverId !== currentUserId) {
      throw forbidden('You cannot accept this contact request')
    }

    if (request.status !== ContactRequestStatus.PENDING) {
      throw badRequest('Contact request is not pending')
    }

    // Atualizar status da solicitação
    await contactRequestRepository.updateStatus(requestId, ContactRequestStatus.ACCEPTED)

    // Criar contato bidirecional
    const contact1 = createContact({
      userId: request.receiverId,
      contactId: request.senderId,
      favorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const contact2 = createContact({
      userId: request.senderId,
      contactId: request.receiverId,
      favorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await Promise.all([contactRepository.save(contact1), contactRepository.save(contact2)])

    return contact1
  }
