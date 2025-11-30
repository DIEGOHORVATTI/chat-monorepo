/**
 * Tipo para configurações do JWT
 */
export interface JWTConfig {
  JWT_SECRET: string
  JWT_ALGORITHM: string
  EXPIRES_IN_DAYS: number
  JWT_REFRESH_SECRET?: string
  JWT_REFRESH_EXPIRES_IN_DAYS?: number
}

/**
 * Tipo para configurações de Cookie
 */
export interface CookieConfig {
  NAME: string
  HTTP_ONLY: boolean
  SECURE: boolean
  SAME_SITE: 'strict' | 'lax' | 'none' | boolean
}

/**
 * Tipo para configurações de Email
 */
export interface EmailConfig {
  EMAIL_FROM: string
  MAIL_HOST: string
  MAIL_PORT: number
  MAIL_USERNAME: string
  MAIL_PASSWORD: string
  EMAIL_CONTACT: string
  CODE_EXPIRATION_TIME: number
}

/**
 * Tipo para configurações do AWS S3
 */
export interface S3Config {
  AWS_ACCESS_KEY: string
  AWS_SECRET_KEY: string
  AWS_REGION: string
  S3_BUCKET: string
}

/**
 * Tipo para configurações gerais da aplicação
 */
export interface AppConfig {
  PORT: string | number
  NODE_ENV: 'development' | 'production'
  WEB_URL: string
  API_BASE_URL: string
  APP_NAME?: string
  VERSION?: string
}

/**
 * Tipo para configurações do banco de dados
 */
export interface DatabaseConfig {
  POSTGRES_URL: string
}

/**
 * Configuração completa do ambiente
 */
export interface EnvConfig {
  JWT: JWTConfig
  COOKIE: CookieConfig
  EMAIL: EmailConfig
  S3: S3Config
  APP: AppConfig
  DATABASE: DatabaseConfig
}
