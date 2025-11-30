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
      findById: async (id: string) => {
        if (id === 'user-2') {
          return { id: 'user-2', email: 'user@example.com' } as any
        }
        return null
      },
      findByEmail: async () => null,
      save: async (user) => user as any,
      findAll: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      updatePrivacy: async (id, privacy) => ({ id, privacy } as any),
      updateStatus: async (id, status) => ({ id, status } as any),
      setCustomStatus: async (id, status, emoji, expiresAt) => ({ id } as any),
      clearCustomStatus: async (id) => ({ id } as any),
      getOnlineUsers: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      deleteUser: async () => undefined,
    } as UserRepository

    contactRepository = {
      findById: async () => null,
      findByUserAndContact: async () => null,
      findAllByUserId: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (contact) => contact as Contact,
      delete: async () => undefined,
    } as ContactRepository

    contactRequestRepository = {
      findById: async () => null,
      findByUsers: async () => null,
      findPendingByReceiver: async () => ({
        data: [],
        meta: { total: 0, page: 1, limit: 10, pages: 0 },
      }),
      findBySender: async () => ({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } }),
      save: async (request) => request as ContactRequest,
      updateStatus: async (id, status) =>
        ({
          id,
          status,
          senderId: 'user-1',
          receiverId: 'user-2',
        } as ContactRequest),
    } as ContactRequestRepository

    addContact = makeAddContact(contactRepository, contactRequestRepository, userRepository)
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
    userRepository.findById = async (id: string) => {
      if (id === 'user-2') {
        return { id: 'user-2', email: 'user@example.com' } as any
      }
      return null
    }
    contactRepository.findByUserAndContact = async () => ({ id: 'contact-1' } as Contact)

    await expect(addContact('user-1', { userId: 'user-2', message: 'Hi' })).rejects.toThrow(
      badRequest('User is already in your contacts')
    )
  })

  it('should throw error when contact request already exists', async () => {
    userRepository.findById = async (id: string) => {
      if (id === 'user-2') {
        return { id: 'user-2', email: 'user@example.com' } as any
      }
      return null
    }
    contactRequestRepository.findByUsers = async () =>
      ({ id: 'request-1', status: 'pending' } as ContactRequest)

    await expect(addContact('user-1', { userId: 'user-2', message: 'Hi' })).rejects.toThrow(
      badRequest('Contact request already exists')
    )
  })
})
