import type { UserRepository } from '@identity/domain/repositories'
import type { ContactRepository, ContactRequestRepository } from '@contacts/domain/repositories'

import { notFound, badRequest } from '@repo/service-core'
import { ContactRequestStatus, createContactRequest } from '@contacts/domain/entities'

export type AddContactData = {
  userId: string
  message?: string
}

export const makeAddContact =
  (
    contactRepository: ContactRepository,
    contactRequestRepository: ContactRequestRepository,
    userRepository: UserRepository
  ) =>
  async (currentUserId: string, data: AddContactData) => {
    const { userId, message } = data

    if (currentUserId === userId) {
      throw badRequest('You cannot add yourself as a contact')
    }

    // Verificar se o usuário alvo existe
    const targetUser = await userRepository.findById(userId)
    if (!targetUser) {
      throw notFound('User not found')
    }

    // Verificar se já existe uma solicitação
    const existingRequest = await contactRequestRepository.findByUsers(currentUserId, userId)
    if (existingRequest) {
      throw badRequest('Contact request already exists')
    }

    // Verificar se já são contatos
    const existingContact = await contactRepository.findByUserAndContact(currentUserId, userId)
    if (existingContact) {
      throw badRequest('User is already in your contacts')
    }

    // Criar solicitação de contato
    const contactRequest = createContactRequest({
      senderId: currentUserId,
      receiverId: userId,
      status: ContactRequestStatus.PENDING,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await contactRequestRepository.save(contactRequest)

    return contactRequest
  }
