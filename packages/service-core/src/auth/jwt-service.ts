import { SignJWT, jwtVerify } from 'jose'

import { ENV } from '../config/env'

import type { JwtService, EncodedJWTUser } from '../types'

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
      const { payload } = await jwtVerify(token, new TextEncoder().encode(ENV.JWT.JWT_SECRET))

      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) return null

      return payload as EncodedJWTUser
    } catch {
      return null
    }
  },
}
