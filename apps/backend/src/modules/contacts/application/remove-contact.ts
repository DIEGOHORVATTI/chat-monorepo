import type { ContactRepository } from '@contacts/domain/repositories'

import { notFound, forbidden } from '@repo/service-core'

export const makeRemoveContact =
  (contactRepository: ContactRepository) => async (currentUserId: string, contactId: string) => {
    const contact = await contactRepository.findById(contactId)

    if (!contact) {
      throw notFound('Contact not found')
    }

    if (contact.userId !== currentUserId) {
      throw forbidden('You cannot remove this contact')
    }

    // Remover contato bidirecional
    const reverseContact = await contactRepository.findByUserAndContact(
      contact.contactId,
      currentUserId
    )

    await Promise.all([
      contactRepository.delete(contactId),
      reverseContact ? contactRepository.delete(reverseContact.id) : Promise.resolve(),
    ])
  }
