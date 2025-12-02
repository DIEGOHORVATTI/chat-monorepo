import { oc } from '@orpc/contract'
import { z } from 'zod'

import { messageResponseSchema, metaSchema, paginationSchema } from '../shared/base.schema'

const reportReasonValues = [
  'spam',
  'harassment',
  'inappropriate_content',
  'hate_speech',
  'violence',
  'impersonation',
  'other',
]

const reportStatusValues = ['pending', 'reviewing', 'resolved', 'dismissed']

const reportSchema = z.object({
  id: z.uuid(),
  reporterId: z.uuid(),
  reportedUserId: z.uuid().optional(),
  reportedMessageId: z.uuid().optional(),
  chatId: z.uuid().optional(),
  reason: z.enum(reportReasonValues),
  description: z.string().optional(),
  status: z.enum(reportStatusValues),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const reportsListResponseSchema = z.object({
  data: z.array(reportSchema),
  meta: metaSchema,
})

const prefix = oc.route({ tags: ['Moderation'] })

export const moderation = oc.prefix('/moderation').router({
  createReport: prefix
    .route({
      method: 'POST',
      path: '/reports',
      summary: 'Criar denúncia',
      description: 'Denuncia um usuário ou mensagem por violação',
    })
    .input(
      z.object({
        reportedUserId: z.uuid().optional(),
        reportedMessageId: z.uuid().optional(),
        chatId: z.uuid().optional(),
        reason: z.enum(reportReasonValues),
        description: z.string().max(500).optional(),
      })
    )
    .output(
      z.object({
        data: reportSchema,
        meta: metaSchema,
      })
    ),

  getReports: prefix
    .route({
      method: 'GET',
      path: '/reports',
      summary: 'Obter denúncias',
      description: 'Obtém lista paginada de denúncias (apenas admin)',
    })
    .input(paginationSchema.extend({ status: z.enum(reportStatusValues).optional() }))
    .output(reportsListResponseSchema),

  muteChat: prefix
    .route({
      method: 'POST',
      path: '/mute',
      summary: 'Silenciar chat',
      description: 'Silencia notificações de um chat',
    })
    .input(
      z.object({
        chatId: z.uuid(),
        duration: z.number().positive().optional(),
      })
    )
    .output(messageResponseSchema),

  unmuteChat: prefix
    .route({
      method: 'DELETE',
      path: '/mute/:chatId',
      summary: 'Reativar chat',
      description: 'Reativa notificações de um chat',
    })
    .output(messageResponseSchema),

  archiveChat: prefix
    .route({
      method: 'POST',
      path: '/archive',
      summary: 'Arquivar chat',
      description: 'Arquiva um chat para ocultá-lo da lista ativa',
    })
    .input(z.object({ chatId: z.uuid() }))
    .output(messageResponseSchema),

  unarchiveChat: prefix
    .route({
      method: 'DELETE',
      path: '/archive/:chatId',
      summary: 'Desarquivar chat',
      description: 'Desarquiva um chat para mostrá-lo na lista ativa',
    })
    .output(messageResponseSchema),

  blockUser: prefix
    .route({
      method: 'POST',
      path: '/block',
      summary: 'Bloquear usuário',
      description: 'Bloqueia um usuário impedindo contato',
    })
    .input(z.object({ userId: z.uuid() }))
    .output(messageResponseSchema),

  unblockUser: prefix
    .route({
      method: 'DELETE',
      path: '/block/:userId',
      summary: 'Desbloquear usuário',
      description: 'Desbloqueia um usuário previamente bloqueado',
    })
    .output(messageResponseSchema),

  getBlockedUsers: prefix
    .route({
      method: 'GET',
      path: '/blocked',
      summary: 'Obter usuários bloqueados',
      description: 'Obtém lista de usuários bloqueados',
    })
    .output(reportsListResponseSchema),
})
