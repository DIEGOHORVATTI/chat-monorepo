import type { Contact } from '@contacts/domain/entities/contact'
import type { ContactRequest } from '@contacts/domain/entities/contact-request'
import type { UserRepository } from '@identity/domain/repositories/user-repository'
import type { ContactRepository } from '@contacts/domain/repositories/contact-repository'
import type { ContactRequestRepository } from '@contacts/domain/repositories/contact-request-repository'

import { it, expect, describe, beforeEach } from 'vitest'
import { notFound, badRequest } from '@repo/service-core'

import { makeAddContact } from '../add-contact'

describe('AddContact Use Case', () => {
  let userRepository: UserRepository
  let contactRepository: ContactRepository
  let contactRequestRepository: ContactRequestRepository
  let addContact: ReturnType<typeof makeAddContact>

  beforeEach(() => {
    userRepository = {
      findById: async () => ({ id: 'user-2', email: 'user@example.com' } as any),
    } as UserRepository

    contactRepository = {
      findByUserAndContact: async () => null,
    } as ContactRepository

    contactRequestRepository = {
      findByUsers: async () => null,
      save: async (request) => request as ContactRequest,
    } as ContactRequestRepository

    addContact = makeAddContact(userRepository, contactRepository, contactRequestRepository)
  })

  it('should create a contact request successfully', async () => {
    const result = await addContact('user-1', {
      userId: 'user-2',
      message: 'Hi, let´s connect!',
    })

    expect(result.senderId).toBe('user-1')
    expect(result.receiverId).toBe('user-2')
    expect(result.message).toBe('Hi, let´s connect!')
    expect(result.status).toBe('pending')
  })

  it('should throw error when trying to add self as contact', async () => {
    await expect(addContact('user-1', { userId: 'user-1', message: 'Hi' })).rejects.toThrow(
      badRequest('You cannot add yourself as a contact')
    )
  })

  it('should throw error when target user does not exist', async () => {
    userRepository.findById = async () => null

    await expect(addContact('user-1', { userId: 'user-2', message: 'Hi' })).rejects.toThrow(
      notFound('User not found')
    )
  })

  it('should throw error when users are already contacts', async () => {
    contactRepository.findByUserAndContact = async () => ({ id: 'contact-1' } as Contact)

    await expect(addContact('user-1', { userId: 'user-2', message: 'Hi' })).rejects.toThrow(
      badRequest('You are already contacts with this user')
    )
  })

  it('should throw error when contact request already exists', async () => {
    contactRequestRepository.findByUsers = async () =>
      ({ id: 'request-1', status: 'pending' } as ContactRequest)

    await expect(addContact('user-1', { userId: 'user-2', message: 'Hi' })).rejects.toThrow(
      badRequest('A contact request already exists between these users')
    )
  })
})
