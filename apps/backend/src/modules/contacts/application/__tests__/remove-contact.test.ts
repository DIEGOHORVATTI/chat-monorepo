import type { Contact } from '@contacts/domain/entities/contact'
import type { ContactRepository } from '@contacts/domain/repositories/contact-repository'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeRemoveContact } from '../remove-contact'

describe('RemoveContact Use Case', () => {
  let contactRepository: ContactRepository
  let removeContact: ReturnType<typeof makeRemoveContact>

  beforeEach(() => {
    contactRepository = {
      findById: async () =>
        ({
          id: 'contact-1',
          userId: 'user-1',
          contactId: 'user-2',
          nickname: null,
          favorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Contact),
      delete: async () => undefined,
      findByUserAndContact: async () =>
        ({
          id: 'contact-2',
          userId: 'user-2',
          contactId: 'user-1',
        } as Contact),
    } as ContactRepository

    removeContact = makeRemoveContact(contactRepository)
  })

  it('should remove bidirectional contact successfully', async () => {
    await expect(removeContact('user-1', 'contact-1')).resolves.not.toThrow()
  })

  it('should throw error when contact does not exist', async () => {
    contactRepository.findById = async () => null

    await expect(removeContact('user-1', 'contact-1')).rejects.toThrow(
      notFound('Contact not found')
    )
  })

  it('should throw error when user is not the owner', async () => {
    await expect(removeContact('user-3', 'contact-1')).rejects.toThrow(
      forbidden('You cannot remove this contact')
    )
  })

  it('should handle case when reverse contact does not exist', async () => {
    contactRepository.findByUserAndContact = async () => null

    await expect(removeContact('user-1', 'contact-1')).resolves.not.toThrow()
  })
})
