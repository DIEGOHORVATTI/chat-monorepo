import type { EncodedJWTUser } from '@repo/contracts'

import { SignJWT, jwtVerify } from 'jose'

import { ENV } from '../config/env'

/**
 * Serviço para lidar com tokens de atualização (refresh tokens)
 */
export const refreshTokenService = {
  /**
   * Gera um token de atualização para o usuário
   * @param payload Dados do usuário a serem codificados no token
   * @returns Token de atualização assinado
   */
  sign: async (payload: EncodedJWTUser): Promise<string> => {
    const now = Math.floor(Date.now() / 1000)
    const refreshExpiration = now + (ENV.JWT.JWT_REFRESH_EXPIRES_IN_DAYS || 30) * 24 * 60 * 60 // 30 dias por padrão

    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: ENV.JWT.JWT_ALGORITHM, typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(refreshExpiration)
      .sign(new TextEncoder().encode(ENV.JWT.JWT_REFRESH_SECRET || ENV.JWT.JWT_SECRET))
  },

  /**
   * Verifica a validade de um token de atualização
   * @param token Token de atualização a ser verificado
   * @returns Dados do usuário se o token for válido, null caso contrário
   */
  verify: async (token: string): Promise<EncodedJWTUser | null> => {
    try {
      const { payload } = await jwtVerify<EncodedJWTUser>(
        token,
        new TextEncoder().encode(ENV.JWT.JWT_REFRESH_SECRET || ENV.JWT.JWT_SECRET)
      )

      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) return null

      return payload
    } catch {
      return null
    }
  },
}
