import type { CookieOptions } from 'express'

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // string(development | production), example: development
      NODE_ENV: 'development' | 'production'

      // General configuration
      PORT: number
      WEB_URL: string
      API_BASE_URL: string

      // JWT secret
      JWT_SECRET: string
      JWT_ALGORITHM: string
      HTTP_ONLY_COOKIE: string
      SECURE_COOKIE: string
      SAME_SITE_COOKIE: CookieOptions['sameSite']
      JWT_EXPIRES_IN_DAYS: string

      // JWT refresh token
      JWT_REFRESH_SECRET: string
      JWT_REFRESH_EXPIRES_IN_DAYS: string

      POSTGRES_URL: string

      // Mail configuration
      MAIL_HOST: string
      MAIL_PASSWORD: string
      MAIL_USERNAME: string
      MAIL_PORT: number
      EMAIL_CONTACT: string

      // AWS S3 Configuration
      BACKEND_AWS_ACCESS_KEY: string
      BACKEND_AWS_SECRET_KEY: string
      BACKEND_AWS_REGION: string
      BACKEND_S3_BUCKET: string
    }
  }
}
