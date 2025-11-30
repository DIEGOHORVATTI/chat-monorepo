import { auth } from '@repo/service-core'
import {
  addContact,
  listContacts,
  removeContact,
  updateContact,
  listSentRequests,
  listContactRequests,
  acceptContactRequest,
  rejectContactRequest,
} from '@/modules/contacts/di/container'

export const addContactRoute = auth.contacts.addContact.handler(
  async ({ input, context: { user } }) => {
    const contactRequest = await addContact(user.id, input)

    return {
      contactRequest: {
        id: contactRequest.id,
        senderId: contactRequest.senderId,
        receiverId: contactRequest.receiverId,
        status: contactRequest.status,
        message: contactRequest.message,
        createdAt: contactRequest.createdAt,
        updatedAt: contactRequest.updatedAt,
      },
      meta: {
        total: 1,
        page: 1,
        limit: 1,
        pages: 1,
      },
    }
  }
)

export const acceptContactRequestRoute = auth.contacts.acceptContactRequest.handler(
  async ({ input, context: { user } }) => {
    const contact = await acceptContactRequest(user.id, input.requestId)

    return {
      contact: {
        id: contact.id,
        userId: contact.userId,
        contactId: contact.contactId,
        nickname: contact.nickname,
        favorite: contact.favorite,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      },
      meta: {
        total: 1,
        page: 1,
        limit: 1,
        pages: 1,
      },
    }
  }
)

export const rejectContactRequestRoute = auth.contacts.rejectContactRequest.handler(
  async ({ input, context: { user } }) => {
    await rejectContactRequest(user.id, input.requestId)

    return {
      message: 'Contact request rejected successfully',
    }
  }
)

export const removeContactRoute = auth.contacts.removeContact.handler(
  async ({ input, context: { user } }) => {
    await removeContact(user.id, input.contactId)

    return {
      message: 'Contact removed successfully',
    }
  }
)

export const updateContactRoute = auth.contacts.updateContact.handler(
  async ({ input, context: { user } }) => {
    const contact = await updateContact(user.id, input.contactId, input)

    return {
      contact: {
        id: contact.id,
        userId: contact.userId,
        contactId: contact.contactId,
        nickname: contact.nickname,
        favorite: contact.favorite,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      },
      meta: {
        total: 1,
        page: 1,
        limit: 1,
        pages: 1,
      },
    }
  }
)

export const listContactsRoute = auth.contacts.listContacts.handler(
  async ({ input, context: { user } }) => {
    const result = await listContacts(user.id, input.page, input.limit)

    return {
      contacts: result.data,
      meta: result.meta,
    }
  }
)

export const listContactRequestsRoute = auth.contacts.listContactRequests.handler(
  async ({ input, context: { user } }) => {
    const result = await listContactRequests(user.id, input.page, input.limit)

    return {
      contactRequests: result.data,
      meta: result.meta,
    }
  }
)

export const getSentRequestsRoute = auth.contacts.getSentRequests.handler(
  async ({ input, context: { user } }) => {
    const result = await listSentRequests(user.id, input.page, input.limit)

    return {
      contactRequests: result.data,
      meta: result.meta,
    }
  }
)
