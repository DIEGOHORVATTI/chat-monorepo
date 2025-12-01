import { oc } from '@orpc/contract'

import {
  emailSchema,
  loginSchema,
  registerSchema,
  userQuerySchema,
  userCreateSchema,
  verifyEmailSchema,
  userResponseSchema,
  messageResponseSchema,
  registerResponseSchema,
  usersListResponseSchema,
  privacyUpdateSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateStatusSchema,
  setCustomStatusSchema,
  onlineUsersResponseSchema,
  statusResponseSchema,
  exportUserDataSchema,
  exportDataResponseSchema,
  deleteAccountSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  refreshTokenResponseSchema,
  userProfileResponseSchema,
} from './identity.schema'

const prefix = oc.route({ tags: ['Identity'] })

export const identity = oc.prefix('/identity').router({
  login: prefix
    .route({
      method: 'POST',
      path: '/login',
      summary: 'Fazer login',
      description: 'Autentica um usuário e retorna um token JWT',
    })
    .input(loginSchema)
    .output(messageResponseSchema),

  register: prefix
    .route({
      method: 'POST',
      path: '/register',
      summary: 'Registrar usuário',
      description: 'Registra um novo usuário',
    })
    .input(registerSchema)
    .output(registerResponseSchema),

  verifyEmail: prefix
    .route({
      method: 'POST',
      path: '/verify-email',
      summary: 'Verificar email',
      description: 'Verifica o email do usuário com código de verificação',
    })
    .input(verifyEmailSchema)
    .output(messageResponseSchema),

  resendVerification: prefix
    .route({
      method: 'POST',
      path: '/resend-verification',
      summary: 'Reenviar código de verificação',
      description: 'Reenvia o código de verificação por email',
    })
    .input(emailSchema)
    .output(messageResponseSchema),

  logout: prefix
    .route({
      method: 'GET',
      path: '/logout',
      summary: 'Fazer logout',
      description: 'Remove o token de autenticação',
    })
    .output(messageResponseSchema),

  me: prefix
    .route({
      method: 'GET',
      path: '/me',
      summary: 'Obter usuário atual',
      description: 'Obtém o usuário autenticado atualmente',
    })
    .output(userResponseSchema),

  listUsers: prefix
    .route({
      method: 'GET',
      path: '/users',
      summary: 'Listar usuários',
      description: 'Lista todos os usuários',
    })
    .input(userQuerySchema)
    .output(usersListResponseSchema),

  getUserById: prefix
    .route({
      method: 'GET',
      path: '/users/:userId',
      summary: 'Obter usuário por ID',
      description: 'Obtém perfil de um usuário específico pelo ID',
    })
    .output(userProfileResponseSchema),

  createUser: prefix
    .route({
      method: 'POST',
      path: '/users',
      summary: 'Criar usuário',
      description: 'Cria um novo usuário',
    })
    .input(userCreateSchema)
    .output(userResponseSchema),

  updatePrivacy: prefix
    .route({
      method: 'PATCH',
      path: '/me/privacy',
      summary: 'Atualizar configurações de privacidade',
      description: 'Atualiza as configurações de privacidade do usuário autenticado',
    })
    .input(privacyUpdateSchema)
    .output(userResponseSchema),

  updateProfile: prefix
    .route({
      method: 'PATCH',
      path: '/me/profile',
      summary: 'Atualizar informações do perfil',
      description: 'Atualiza nome, avatar ou fuso horário',
    })
    .input(updateProfileSchema)
    .output(userResponseSchema),

  changePassword: prefix
    .route({
      method: 'PATCH',
      path: '/me/change-password',
      summary: 'Alterar senha',
      description: 'Atualiza a senha do usuário',
    })
    .input(changePasswordSchema)
    .output(messageResponseSchema),

  blockUser: prefix
    .route({
      method: 'POST',
      path: '/me/block/:userId',
      summary: 'Bloquear usuário',
      description: 'Bloqueia outro usuário',
    })
    .output(messageResponseSchema),

  unblockUser: prefix
    .route({
      method: 'DELETE',
      path: '/me/block/:userId',
      summary: 'Desbloquear usuário',
      description: 'Desbloqueia um usuário previamente bloqueado',
    })
    .output(messageResponseSchema),

  updateStatus: prefix
    .route({
      method: 'PATCH',
      path: '/me/status',
      summary: 'Atualizar status',
      description: 'Atualiza o status do usuário (online/ausente/ocupado/offline)',
    })
    .input(updateStatusSchema)
    .output(statusResponseSchema),

  setCustomStatus: prefix
    .route({
      method: 'PATCH',
      path: '/me/custom-status',
      summary: 'Definir status personalizado',
      description: 'Define mensagem de status personalizada com emoji e expiração opcionais',
    })
    .input(setCustomStatusSchema)
    .output(statusResponseSchema),

  clearCustomStatus: prefix
    .route({
      method: 'DELETE',
      path: '/me/custom-status',
      summary: 'Limpar status personalizado',
      description: 'Remove mensagem de status personalizada',
    })
    .output(messageResponseSchema),

  getOnlineUsers: prefix
    .route({
      method: 'GET',
      path: '/users/online',
      summary: 'Obter usuários online',
      description: 'Lista todos os usuários online',
    })
    .output(onlineUsersResponseSchema),

  exportUserData: prefix
    .route({
      method: 'POST',
      path: '/me/export',
      summary: 'Exportar dados do usuário',
      description: 'Solicita exportação de todos os dados do usuário (conformidade LGPD)',
    })
    .input(exportUserDataSchema)
    .output(exportDataResponseSchema),

  deleteAccount: prefix
    .route({
      method: 'DELETE',
      path: '/me/account',
      summary: 'Excluir conta',
      description: 'Exclui permanentemente a conta do usuário e todos os dados associados',
    })
    .input(deleteAccountSchema)
    .output(messageResponseSchema),

  forgotPassword: prefix
    .route({
      method: 'POST',
      path: '/forgot-password',
      summary: 'Esqueci a senha',
      description: 'Solicita email de redefinição de senha',
    })
    .input(forgotPasswordSchema)
    .output(messageResponseSchema),

  resetPassword: prefix
    .route({
      method: 'POST',
      path: '/reset-password',
      summary: 'Redefinir senha',
      description: 'Redefine a senha usando token do email',
    })
    .input(resetPasswordSchema)
    .output(messageResponseSchema),

  refreshToken: prefix
    .route({
      method: 'POST',
      path: '/refresh-token',
      summary: 'Atualizar token',
      description: 'Atualiza o token de acesso usando refresh token',
    })
    .input(refreshTokenSchema)
    .output(refreshTokenResponseSchema),
})
