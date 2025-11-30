import type { Contact } from '@contacts/domain/entities/contact'
import type { ContactRepository } from '@contacts/domain/repositories/contact-repository'

import { notFound, forbidden } from '@repo/service-core'
import { it, expect, describe, beforeEach } from 'vitest'

import { makeUpdateContact } from '../update-contact'

describe('UpdateContact Use Case', () => {
  let contactRepository: ContactRepository
  let updateContact: ReturnType<typeof makeUpdateContact>

  beforeEach(() => {
    contactRepository = {
      findById: async () =>
        ({
          id: 'contact-1',
          userId: 'user-1',
          contactId: 'user-2',
          nickname: 'Old Nick',
          favorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Contact),
      save: async (contact) => contact as Contact,
    } as ContactRepository

    updateContact = makeUpdateContact(contactRepository)
  })

  it('should update contact nickname successfully', async () => {
    const result = await updateContact('user-1', 'contact-1', {
      nickname: 'New Nick',
    })

    expect(result.nickname).toBe('New Nick')
    expect(result.favorite).toBe(false)
  })

  it('should update contact favorite status successfully', async () => {
    const result = await updateContact('user-1', 'contact-1', {
      favorite: true,
    })

    expect(result.favorite).toBe(true)
    expect(result.nickname).toBe('Old Nick')
  })

  it('should update both nickname and favorite', async () => {
    const result = await updateContact('user-1', 'contact-1', {
      nickname: 'Best Friend',
      favorite: true,
    })

    expect(result.nickname).toBe('Best Friend')
    expect(result.favorite).toBe(true)
  })

  it('should throw error when contact does not exist', async () => {
    contactRepository.findById = async () => null

    await expect(updateContact('user-1', 'contact-1', { nickname: 'Test' })).rejects.toThrow(
      notFound('Contact not found')
    )
  })

  it('should throw error when user is not the owner', async () => {
    await expect(updateContact('user-3', 'contact-1', { nickname: 'Test' })).rejects.toThrow(
      forbidden('You cannot update this contact')
    )
  })

  it('should handle clearing nickname', async () => {
    const result = await updateContact('user-1', 'contact-1', {
      nickname: null,
    })

    expect(result.nickname).toBeNull()
  })
})
