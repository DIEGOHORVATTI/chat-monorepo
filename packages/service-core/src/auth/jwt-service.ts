import type { EncodedJWTUser } from '@repo/contracts'
import type { JwtService } from '../types'

import { SignJWT, jwtVerify } from 'jose'

import { ENV } from '../config/env'

export const jwtService: JwtService = {
  sign: async (payload) => {
    const now = Math.floor(Date.now() / 1000)
    const expiration = now + ENV.JWT.EXPIRES_IN_DAYS * 24 * 60 * 60 // Convert days to seconds

    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: ENV.JWT.JWT_ALGORITHM, typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(new TextEncoder().encode(ENV.JWT.JWT_SECRET))
  },

  verify: async (token) => {
    try {
      const { payload } = await jwtVerify<EncodedJWTUser>(
        token,
        new TextEncoder().encode(ENV.JWT.JWT_SECRET)
      )

      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) return null

      return payload
    } catch {
      return null
    }
  },
}
