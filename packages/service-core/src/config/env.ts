import type { EnvConfig } from '../types/env'

const isProductionMode = process.env.NODE_ENV === 'production'

/**
 * Configurações de ambiente centralizadas
 */
export const ENV: EnvConfig = {
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret',
    EXPIRES_IN_DAYS: parseInt(process.env.JWT_EXPIRES_IN_DAYS ?? '7'),
    JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? '30'),
  },
  COOKIE: {
    NAME: process.env.COOKIE_NAME || 'auth_token',
    HTTP_ONLY: process.env.HTTP_ONLY_COOKIE === 'false' ? false : true,
    SECURE: process.env.SECURE_COOKIE === 'true' || isProductionMode,
    SAME_SITE:
      (process.env.SAME_SITE_COOKIE as 'strict' | 'lax' | 'none') ||
      (isProductionMode ? 'none' : 'lax'),
  },
  APP: {
    PORT: process.env.PORT || 8000,
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
    WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },
  DATABASE: {
    POSTGRES_URL: process.env.POSTGRES_URL || '',
  },
  EMAIL: {
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@horvattichamp.com',
    MAIL_HOST: process.env.MAIL_HOST || '',
    MAIL_PORT: Number(process.env.MAIL_PORT || 587),
    MAIL_USERNAME: process.env.MAIL_USERNAME || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
    EMAIL_CONTACT: process.env.EMAIL_CONTACT || '',
    CODE_EXPIRATION_TIME: process.env.CODE_EXPIRATION_TIME
      ? Number(process.env.CODE_EXPIRATION_TIME) * 60 * 1000 // minutos para milissegundos
      : 15 * 60 * 1000, // 15 minutos padrão
  },
  S3: {
    AWS_ACCESS_KEY: process.env.BACKEND_AWS_ACCESS_KEY || '',
    AWS_SECRET_KEY: process.env.BACKEND_AWS_SECRET_KEY || '',
    AWS_REGION: process.env.BACKEND_AWS_REGION || '',
    S3_BUCKET: process.env.BACKEND_S3_BUCKET || '',
  },
}
