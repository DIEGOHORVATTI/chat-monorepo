import type { ContactRepository } from '@contacts/domain/repositories'

export const makeListContacts =
  (contactRepository: ContactRepository) =>
  async (userId: string, page = 1, limit = 20) =>
    await contactRepository.findAllByUserId(userId, page, limit)
