import type { ContactRequestRepository } from '@contacts/domain/repositories'

import { ContactRequestStatus } from '@contacts/domain/entities'
import { notFound, forbidden, badRequest } from '@repo/service-core'

export const makeRejectContactRequest =
  (contactRequestRepository: ContactRequestRepository) =>
  async (currentUserId: string, requestId: string) => {
    const request = await contactRequestRepository.findById(requestId)

    if (!request) {
      throw notFound('Contact request not found')
    }

    if (request.receiverId !== currentUserId) {
      throw forbidden('You cannot reject this contact request')
    }

    if (request.status !== ContactRequestStatus.PENDING) {
      throw badRequest('Contact request is not pending')
    }

    await contactRequestRepository.updateStatus(requestId, ContactRequestStatus.REJECTED)
  }
