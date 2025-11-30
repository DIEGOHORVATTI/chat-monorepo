import type { EncodedJWTUser } from '@repo/contracts'
import type {
  RequestHeadersPluginContext,
  ResponseHeadersPluginContext,
} from '@orpc/server/plugins'

// Exporta tipos de configuração de ambiente
export * from './env'

/**
 * Contexto básico do ORPC
 */
export type ORPContext = RequestHeadersPluginContext & ResponseHeadersPluginContext

/**
 * Contexto de requisição com usuário autenticado
 */
export type UserRequestContext = ORPContext & {
  user: EncodedJWTUser
}

/**
 * Interface do serviço JWT
 */
export interface JwtService {
  sign(payload: EncodedJWTUser): Promise<string>
  verify(token: string): Promise<EncodedJWTUser | null>
}
