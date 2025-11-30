import type { ContactRepository } from '@contacts/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export type UpdateContactData = {
  nickname?: string
  favorite?: boolean
}

export const makeUpdateContact =
  (contactRepository: ContactRepository) =>
  async (currentUserId: string, contactId: string, data: UpdateContactData) => {
    const contact = await contactRepository.findById(contactId)

    if (!contact) {
      throw notFound('Contact not found')
    }

    if (contact.userId !== currentUserId) {
      throw forbidden('You cannot update this contact')
    }

    const updatedContact = {
      ...contact,
      ...(data.nickname !== undefined && { nickname: data.nickname }),
      ...(data.favorite !== undefined && { favorite: data.favorite }),
      updatedAt: new Date(),
    }

    await contactRepository.save(updatedContact)

    return updatedContact
  }
