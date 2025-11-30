import { implement } from '@orpc/server'
import { contracts } from '@repo/contracts'

import { authMiddleware } from '../auth/auth-middleware'

import type { ORPContext, UserRequestContext } from '../types'

/**
 * Contexto público do ORPC
 * Disponível para rotas que não requerem autenticação
 */
export const pub = implement(contracts).$context<ORPContext>()

/**
 * Contexto autenticado do ORPC
 * Disponível para rotas que requerem autenticação
 */
export const auth = pub.$context<UserRequestContext>().use(authMiddleware)
