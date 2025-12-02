import { oc } from '@orpc/contract'

import {
  addContactSchema,
  acceptContactRequestSchema,
  rejectContactRequestSchema,
  updateContactSchema,
  contactsQuerySchema,
  contactResponseSchema,
  contactRequestResponseSchema,
  contactsListResponseSchema,
  contactRequestsListResponseSchema,
  messageResponseSchema,
} from './contacts.schema'

import z from 'zod'

const prefix = oc.route({ tags: ['Contacts'] })

export const contacts = oc.prefix('/contacts').router({
  addContact: prefix
    .route({
      method: 'POST',
      path: '/',
      summary: 'Adicionar contato',
      description: 'Envia uma solicitação de contato para um usuário',
    })
    .input(addContactSchema)
    .output(contactRequestResponseSchema),

  acceptContactRequest: prefix
    .route({
      method: 'POST',
      path: '/requests/:requestId/accept',
      summary: 'Aceitar solicitação de contato',
      description: 'Aceita uma solicitação de contato pendente',
    })
    .input(acceptContactRequestSchema)
    .output(contactResponseSchema),

  rejectContactRequest: prefix
    .route({
      method: 'POST',
      path: '/requests/:requestId/reject',
      summary: 'Rejeitar solicitação de contato',
      description: 'Rejeita uma solicitação de contato pendente',
    })
    .input(rejectContactRequestSchema)
    .output(messageResponseSchema),

  removeContact: prefix
    .route({
      method: 'DELETE',
      path: '/:contactId',
      summary: 'Remover contato',
      description: 'Remove um contato da sua lista',
    })
    .input(z.object({ contactId: z.string().uuid() }))
    .output(messageResponseSchema),

  updateContact: prefix
    .route({
      method: 'PATCH',
      path: '/:contactId',
      summary: 'Atualizar contato',
      description: 'Atualiza apelido ou status de favorito do contato',
    })
    .input(updateContactSchema)
    .output(contactResponseSchema),

  listContacts: prefix
    .route({
      method: 'GET',
      path: '/',
      summary: 'Listar contatos',
      description: 'Obtém todos os contatos com paginação',
    })
    .input(contactsQuerySchema)
    .output(contactsListResponseSchema),

  listContactRequests: prefix
    .route({
      method: 'GET',
      path: '/requests',
      summary: 'Listar solicitações de contato',
      description: 'Obtém todas as solicitações de contato pendentes',
    })
    .input(contactsQuerySchema)
    .output(contactRequestsListResponseSchema),

  getSentRequests: prefix
    .route({
      method: 'GET',
      path: '/requests/sent',
      summary: 'Listar solicitações enviadas',
      description: 'Obtém todas as solicitações de contato que você enviou',
    })
    .input(contactsQuerySchema)
    .output(contactRequestsListResponseSchema),
})
