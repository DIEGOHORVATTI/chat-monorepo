import { oc } from '@orpc/contract'
import { messageResponseSchema } from '../../shared/base.schema'
import {
  createReportSchema,
  muteChatSchema,
  archiveChatSchema,
  blockUserSchema,
  getReportsQuerySchema,
  reportResponseSchema,
  reportsListResponseSchema,
} from './moderation.schema'

const prefix = oc.route({ tags: ['Moderation'] })

export const moderation = oc.prefix('/moderation').router({
  createReport: prefix
    .route({
      method: 'POST',
      path: '/reports',
      summary: 'Criar denúncia',
      description: 'Denuncia um usuário ou mensagem por violação',
    })
    .input(createReportSchema)
    .output(reportResponseSchema),

  getReports: prefix
    .route({
      method: 'GET',
      path: '/reports',
      summary: 'Obter denúncias',
      description: 'Obtém lista paginada de denúncias (apenas admin)',
    })
    .input(getReportsQuerySchema)
    .output(reportsListResponseSchema),

  muteChat: prefix
    .route({
      method: 'POST',
      path: '/mute',
      summary: 'Silenciar chat',
      description: 'Silencia notificações de um chat',
    })
    .input(muteChatSchema)
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
    .input(archiveChatSchema)
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
    .input(blockUserSchema)
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
