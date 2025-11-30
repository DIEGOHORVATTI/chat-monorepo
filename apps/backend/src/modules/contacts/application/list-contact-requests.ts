import type { ContactRequestRepository } from '@contacts/domain/repositories'

export const makeListContactRequests =
  (contactRequestRepository: ContactRequestRepository) =>
  async (userId: string, page = 1, limit = 20) =>
    await contactRequestRepository.findPendingByReceiver(userId, page, limit)
