import { oc } from '@orpc/contract'
import { z } from 'zod'
import { meta, paginationSchema } from '../shared'

const ContactRequestStatus = z.enum(['pending', 'accepted', 'rejected'])

const contactSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  contactId: z.uuid(),
  nickname: z.string().optional(),
  favorite: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const contactRequestSchema = z.object({
  id: z.uuid(),
  senderId: z.uuid(),
  receiverId: z.uuid(),
  status: ContactRequestStatus,
  message: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const prefix = oc.route({ tags: ['Contacts'] })

export const contacts = oc.prefix('/contacts').router({
  addContact: prefix
    .route({
      method: 'POST',
      path: '/',
      summary: 'Adicionar contato',
      description: 'Envia uma solicitação de contato para um usuário',
    })
    .input(
      z.object({
        userId: z.uuid(),
        message: z.string().max(200).optional(),
      })
    )
    .output(
      z.object({
        data: contactRequestSchema,
        meta,
      })
    ),

  acceptContactRequest: prefix
    .route({
      method: 'POST',
      path: '/requests/:requestId/accept',
      summary: 'Aceitar solicitação de contato',
      description: 'Aceita uma solicitação pendente',
    })
    .input(
      z.object({
        requestId: z.uuid(),
      })
    )
    .output(
      z.object({
        data: contactSchema,
        meta,
      })
    ),

  rejectContactRequest: prefix
    .route({
      method: 'POST',
      path: '/requests/:requestId/reject',
      summary: 'Rejeitar solicitação de contato',
      description: 'Rejeita uma solicitação pendente',
    })
    .input(
      z.object({
        requestId: z.uuid(),
      })
    )
    .output(
      z.object({
        message: z.string(),
        meta,
      })
    ),

  removeContact: prefix
    .route({
      method: 'DELETE',
      path: '/:contactId',
      summary: 'Remover contato',
      description: 'Remove um contato da sua lista',
    })
    .input(
      z.object({
        contactId: z.uuid(),
      })
    )
    .output(
      z.object({
        message: z.string(),
        meta,
      })
    ),

  updateContact: prefix
    .route({
      method: 'PATCH',
      path: '/:contactId',
      summary: 'Atualizar contato',
      description: 'Atualiza apelido ou favorito',
    })
    .input(
      z.object({
        contactId: z.uuid(),
        nickname: z.string().min(1).max(50).optional(),
        favorite: z.boolean().optional(),
      })
    )
    .output(
      z.object({
        data: contactSchema,
        meta,
      })
    ),

  listContacts: prefix
    .route({
      method: 'GET',
      path: '/',
      summary: 'Listar contatos',
      description: 'Lista contatos com paginação',
    })
    .input(
      paginationSchema.extend({
        search: z.string().optional(),
        favorites: z.boolean().optional(),
      })
    )
    .output(
      z.object({
        data: z.array(contactSchema),
        meta,
      })
    ),

  listContactRequests: prefix
    .route({
      method: 'GET',
      path: '/requests',
      summary: 'Listar solicitações',
      description: 'Lista solicitações pendentes',
    })
    .input(
      paginationSchema.extend({
        search: z.string().optional(),
        favorites: z.boolean().optional(),
      })
    )
    .output(
      z.object({
        data: z.array(contactRequestSchema),
        meta,
      })
    ),

  getSentRequests: prefix
    .route({
      method: 'GET',
      path: '/requests/sent',
      summary: 'Listar solicitações enviadas',
      description: 'Lista solicitações que você enviou',
    })
    .input(
      paginationSchema.extend({
        search: z.string().optional(),
        favorites: z.boolean().optional(),
      })
    )
    .output(
      z.object({
        data: z.array(contactRequestSchema),
        meta,
      })
    ),
})
