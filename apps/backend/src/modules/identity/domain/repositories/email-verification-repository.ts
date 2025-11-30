import type { EmailVerification } from '@identity/domain/entities'

export type EmailVerificationRepository = {
  save(emailVerification: EmailVerification): Promise<void>
  findByUserIdAndCode(userId: string, code: string): Promise<EmailVerification | null>
  findActiveByUserId(userId: string): Promise<EmailVerification[]>
  markAsUsed(id: string): Promise<void>
}
