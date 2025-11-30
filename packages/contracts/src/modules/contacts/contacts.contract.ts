import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../identity/identity.schema'
import {
  addContactSchema,
  acceptContactRequestSchema,
  rejectContactRequestSchema,
  removeContactSchema,
  updateContactSchema,
  contactsQuerySchema,
  contactResponseSchema,
  contactRequestResponseSchema,
  contactsListResponseSchema,
  contactRequestsListResponseSchema,
} from './contacts.schema'

const prefix = oc.route({ tags: ['Contacts'] })

export const contacts = oc.prefix('/contacts').router({
  addContact: prefix
    .route({
      method: 'POST',
      path: '/',
      summary: 'Add contact',
      description: 'Send a contact request to a user',
    })
    .input(addContactSchema)
    .output(contactRequestResponseSchema),

  acceptContactRequest: prefix
    .route({
      method: 'POST',
      path: '/requests/:requestId/accept',
      summary: 'Accept contact request',
      description: 'Accept a pending contact request',
    })
    .input(acceptContactRequestSchema)
    .output(contactResponseSchema),

  rejectContactRequest: prefix
    .route({
      method: 'POST',
      path: '/requests/:requestId/reject',
      summary: 'Reject contact request',
      description: 'Reject a pending contact request',
    })
    .input(rejectContactRequestSchema)
    .output(messageResponseSchema),

  removeContact: prefix
    .route({
      method: 'DELETE',
      path: '/:contactId',
      summary: 'Remove contact',
      description: 'Remove a contact from your list',
    })
    .output(messageResponseSchema),

  updateContact: prefix
    .route({
      method: 'PATCH',
      path: '/:contactId',
      summary: 'Update contact',
      description: 'Update contact nickname or favorite status',
    })
    .input(updateContactSchema)
    .output(contactResponseSchema),

  listContacts: prefix
    .route({
      method: 'GET',
      path: '/',
      summary: 'List contacts',
      description: 'Get all contacts with pagination',
    })
    .input(contactsQuerySchema)
    .output(contactsListResponseSchema),

  listContactRequests: prefix
    .route({
      method: 'GET',
      path: '/requests',
      summary: 'List contact requests',
      description: 'Get all pending contact requests',
    })
    .input(contactsQuerySchema)
    .output(contactRequestsListResponseSchema),

  getSentRequests: prefix
    .route({
      method: 'GET',
      path: '/requests/sent',
      summary: 'List sent requests',
      description: 'Get all contact requests you sent',
    })
    .input(contactsQuerySchema)
    .output(contactRequestsListResponseSchema),
})
