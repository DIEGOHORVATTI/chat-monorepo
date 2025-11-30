import { os } from '@orpc/server'
import { getCookie } from '@orpc/server/helpers'

import { ENV } from '../config/env'
import { notFound } from '../apiError'
import { jwtService } from './jwt-service'

import type { UserRequestContext } from '../types'

/**
 * Middleware de autenticação
 * Verifica se o token é válido e adiciona o usuário ao contexto
 */
export const authMiddleware = os
  .$context<UserRequestContext>()
  .middleware(async ({ context, next }) => {
    const token = getCookie(context.reqHeaders, ENV.COOKIE.NAME)

    if (!token) {
      throw notFound('No token provided')
    }

    const user = await jwtService.verify(token)

    if (!user) {
      throw notFound('Invalid token')
    }

    context.user = user

    return next()
  })
