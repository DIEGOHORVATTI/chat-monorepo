import type { Entity } from '@/core/domain/entity'

export type EmailVerificationProps = {
  userId: string
  code: string
  expires: Date
  isUsed: boolean
  createdAt: Date
  updatedAt: Date
}

export type EmailVerification = Entity<EmailVerificationProps>

export const createEmailVerification = (
  props: EmailVerificationProps,
  id?: string
): EmailVerification => ({
  id: id || crypto.randomUUID(),
  ...props,
})

export const generateVerificationCode = (): string =>
  Math.random().toString(36).substring(2, 8).toUpperCase()

export const createVerificationExpiry = (): Date => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 10) // Expira em 10 minutos

  return now
}
