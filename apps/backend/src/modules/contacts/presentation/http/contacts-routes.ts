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
      data: {
        id: contactRequest.id,
        senderId: contactRequest.senderId,
        receiverId: contactRequest.receiverId,
        status: contactRequest.status,
        message: contactRequest.message ?? undefined,
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
      data: {
        id: contact.id,
        userId: contact.userId,
        contactId: contact.contactId,
        nickname: contact.nickname ?? undefined,
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
      meta: { total: 1, page: 1, limit: 1, pages: 1 },
    }
  }
)

export const removeContactRoute = auth.contacts.removeContact.handler(
  async ({ input, context: { user } }) => {
    await removeContact(user.id, input.contactId)

    return {
      message: 'Contact removed successfully',
      meta: { total: 1, page: 1, limit: 1, pages: 1 },
    }
  }
)

export const updateContactRoute = auth.contacts.updateContact.handler(
  async ({ input, context: { user } }) => {
    const contact = await updateContact(user.id, input.contactId, input)

    return {
      data: {
        id: contact.id,
        userId: contact.userId,
        contactId: contact.contactId,
        nickname: contact.nickname ?? undefined,
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
    const { page, limit } = input as {
      page: number
      limit: number
      search?: string
      favorites?: boolean
    }

    const result = await listContacts(user.id, page, limit)

    return {
      data: result.data.map((c) => ({
        id: c.id,
        userId: c.userId,
        contactId: c.contactId,
        favorite: c.favorite,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        nickname: c.nickname ?? undefined,
      })),
      meta: result.meta,
    }
  }
)

export const listContactRequestsRoute = auth.contacts.listContactRequests.handler(
  async ({ input, context: { user } }) => {
    const { page, limit } = input as {
      page: number
      limit: number
      search?: string
      favorites?: boolean
    }

    const result = await listContactRequests(user.id, page, limit)

    return {
      data: result.data.map((cr) => ({
        id: cr.id,
        senderId: cr.senderId,
        receiverId: cr.receiverId,
        status: cr.status,
        createdAt: cr.createdAt,
        updatedAt: cr.updatedAt,
        message: cr.message ?? undefined,
      })),
      meta: result.meta,
    }
  }
)

export const getSentRequestsRoute = auth.contacts.getSentRequests.handler(
  async ({ input, context: { user } }) => {
    const { page, limit } = input as {
      page: number
      limit: number
      search?: string
      favorites?: boolean
    }

    const result = await listSentRequests(user.id, page, limit)

    return {
      data: result.data.map((cr) => ({
        id: cr.id,
        senderId: cr.senderId,
        receiverId: cr.receiverId,
        status: cr.status,
        createdAt: cr.createdAt,
        updatedAt: cr.updatedAt,
        message: cr.message ?? undefined,
      })),
      meta: result.meta,
    }
  }
)
