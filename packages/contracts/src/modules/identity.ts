import { oc } from '@orpc/contract'
import { z } from 'zod'

import { meta, paginationSchema } from '../shared/base.schema'

enum UserStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

const privacyVisibility = z.enum(['everyone', 'contacts', 'contacts_except', 'nobody'])

const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  password: z.string().min(6),
  avatarUrl: z.url().nullable().optional(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean(),
  lastLoginAt: z.date().nullable().optional(),
  timezone: z.string().nullable().optional(),
  privacy: z
    .object({
      profilePhoto: privacyVisibility,
      lastSeen: privacyVisibility,
      status: privacyVisibility,
      readReceipts: z.boolean(),
      allowMessagesFrom: privacyVisibility,
      allowCallsFrom: privacyVisibility,
      blockedUsers: z.array(z.uuid()),
    })
    .default({
      profilePhoto: 'everyone',
      lastSeen: 'everyone',
      status: 'everyone',
      readReceipts: true,
      allowMessagesFrom: 'everyone',
      allowCallsFrom: 'everyone',
      blockedUsers: [],
    }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const prefix = oc.route({ tags: ['Identity'] })

export const identity = oc.prefix('/identity').router({
  login: prefix
    .route({
      method: 'POST',
      path: '/login',
      summary: 'Fazer login',
      description: 'Autentica um usuário e retorna um token JWT',
    })
    .input(
      userSchema.pick({
        email: true,
        password: true,
      })
    )
    .output(
      z.object({
        message: z.string(),
      })
    ),

  register: prefix
    .route({
      method: 'POST',
      path: '/register',
      summary: 'Registrar usuário',
      description: 'Registra um novo usuário',
    })
    .input(
      userSchema.pick({
        name: true,
        email: true,
        password: true,
      })
    )
    .output(z.object({ message: z.string() })),

  verifyEmail: prefix
    .route({
      method: 'POST',
      path: '/verify-email',
      summary: 'Verificar email',
      description: 'Verifica o email do usuário',
    })
    .input(
      z.object({
        userId: z.string(),
        code: z.string().length(6),
      })
    )
    .output(z.object({ message: z.string() })),

  resendVerification: prefix
    .route({
      method: 'POST',
      path: '/resend-verification',
      summary: 'Reenviar código',
      description: 'Reenvia código por email',
    })
    .input(userSchema.pick({ email: true }))
    .output(z.object({ message: z.string() })),

  logout: prefix
    .route({
      method: 'GET',
      path: '/logout',
      summary: 'Fazer logout',
      description: 'Remove o token de autenticação',
    })
    .output(z.object({ message: z.string() })),

  me: prefix
    .route({
      method: 'GET',
      path: '/me',
      summary: 'Obter usuário atual',
      description: 'Obtém o usuário autenticado',
    })
    .output(
      z.object({
        user: userSchema
          .pick({
            id: true,
            name: true,
            email: true,
            permissions: true,
          })
          .extend({
            exp: z.number().optional(),
            iat: z.number().optional(),
          }),
      })
    ),

  listUsers: prefix
    .route({
      method: 'GET',
      path: '/users',
      summary: 'Listar usuários',
      description: 'Lista todos os usuários',
    })
    .input(paginationSchema)
    .output(
      z.object({
        users: z.array(userSchema.omit({ password: true })),
        meta,
      })
    ),

  getUserById: prefix
    .route({
      method: 'GET',
      path: '/users/:userId',
      summary: 'Obter usuário por ID',
      description: 'Obtém perfil do usuário',
    })
    .input(z.object({ userId: z.uuid() }))
    .output(
      z.object({
        user: userSchema.omit({ password: true }),
      })
    ),

  createUser: prefix
    .route({
      method: 'POST',
      path: '/users',
      summary: 'Criar usuário',
      description: 'Cria usuário',
    })
    .input(
      userSchema.pick({
        name: true,
        email: true,
      })
    )
    .output(
      z.object({
        user: userSchema.pick({
          id: true,
          name: true,
          email: true,
          permissions: true,
        }),
      })
    ),

  updatePrivacy: prefix
    .route({
      method: 'PATCH',
      path: '/me/privacy',
      summary: 'Atualizar privacidade',
      description: 'Atualiza privacidade',
    })
    .input(
      z.object({
        profilePhoto: privacyVisibility.optional(),
        lastSeen: privacyVisibility.optional(),
        status: privacyVisibility.optional(),
        readReceipts: z.boolean().optional(),
        allowMessagesFrom: privacyVisibility.optional(),
        allowCallsFrom: privacyVisibility.optional(),
        blockedUsers: z.array(z.uuid()).optional(),
      })
    )
    .output(
      z.object({
        user: userSchema.pick({
          id: true,
          name: true,
          email: true,
          permissions: true,
        }),
      })
    ),

  updateProfile: prefix
    .route({
      method: 'PATCH',
      path: '/me/profile',
      summary: 'Atualizar perfil',
      description: 'Atualiza nome, avatar ou timezone',
    })
    .input(
      z.object({
        name: z.string().optional(),
        avatarUrl: z.url().optional(),
        timezone: z.string().optional(),
      })
    )
    .output(
      z.object({
        user: userSchema.pick({
          id: true,
          name: true,
          email: true,
        }),
      })
    ),

  changePassword: prefix
    .route({
      method: 'PATCH',
      path: '/me/change-password',
      summary: 'Alterar senha',
      description: 'Atualiza senha',
    })
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .output(z.object({ message: z.string() })),

  blockUser: prefix
    .route({
      method: 'POST',
      path: '/me/block/:userId',
      summary: 'Bloquear usuário',
      description: 'Bloqueia outro usuário',
    })
    .input(z.object({ userId: z.uuid() }))
    .output(z.object({ message: z.string() })),

  unblockUser: prefix
    .route({
      method: 'DELETE',
      path: '/me/block/:userId',
      summary: 'Desbloquear usuário',
      description: 'Desbloqueia usuário',
    })
    .input(z.object({ userId: z.uuid() }))
    .output(z.object({ message: z.string() })),

  updateStatus: prefix
    .route({
      method: 'PATCH',
      path: '/me/status',
      summary: 'Atualizar status',
      description: 'Atualiza status',
    })
    .input(z.object({ status: z.enum(UserStatus) }))
    .output(
      z.object({
        status: z.enum(UserStatus),
        customStatus: z.string().optional(),
      })
    ),

  setCustomStatus: prefix
    .route({
      method: 'PATCH',
      path: '/me/custom-status',
      summary: 'Definir status personalizado',
      description: 'Define status personalizado',
    })
    .input(
      z.object({
        customStatus: z.string().max(100),
        emoji: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .output(
      z.object({
        status: z.enum(UserStatus),
        customStatus: z.string().optional(),
      })
    ),

  clearCustomStatus: prefix
    .route({
      method: 'DELETE',
      path: '/me/custom-status',
      summary: 'Limpar status personalizado',
      description: 'Remove status personalizado',
    })
    .output(z.object({ message: z.string() })),

  getOnlineUsers: prefix
    .route({
      method: 'GET',
      path: '/users/online',
      summary: 'Obter usuários online',
      description: 'Lista usuários online',
    })
    .output(
      z.object({
        users: z.array(
          z.object({
            id: z.uuid(),
            name: z.string(),
            avatarUrl: z.url().nullable().optional(),
            status: z.enum(UserStatus),
            customStatus: z.string().optional(),
            lastSeen: z.date(),
          })
        ),
        meta,
      })
    ),

  exportUserData: prefix
    .route({
      method: 'POST',
      path: '/me/export',
      summary: 'Exportar dados',
      description: 'Exporta todos os dados do usuário',
    })
    .input(
      z.object({
        format: z.enum(['json', 'csv']).optional().default('json'),
      })
    )
    .output(
      z.object({
        downloadUrl: z.url(),
        expiresAt: z.coerce.date(),
        meta,
      })
    ),

  deleteAccount: prefix
    .route({
      method: 'DELETE',
      path: '/me/account',
      summary: 'Excluir conta',
      description: 'Remove conta e dados',
    })
    .input(
      z.object({
        password: z.string().min(8),
        confirmation: z.literal('DELETE_MY_ACCOUNT'),
      })
    )
    .output(z.object({ message: z.string() })),

  forgotPassword: prefix
    .route({
      method: 'POST',
      path: '/forgot-password',
      summary: 'Esqueci a senha',
      description: 'Solicita email de redefinição',
    })
    .input(z.object({ email: z.email() }))
    .output(z.object({ message: z.string() })),

  resetPassword: prefix
    .route({
      method: 'POST',
      path: '/reset-password',
      summary: 'Redefinir senha',
      description: 'Redefine senha via token',
    })
    .input(
      z.object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
    )
    .output(z.object({ message: z.string() })),

  refreshToken: prefix
    .route({
      method: 'POST',
      path: '/refresh-token',
      summary: 'Atualizar token',
      description: 'Usa refresh token',
    })
    .input(z.object({ refreshToken: z.string().min(1) }))
    .output(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        expiresIn: z.number(),
        meta,
      })
    ),
})
