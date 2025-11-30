import type { EmailVerification } from '@identity/domain/entities'
import type {
  emailVerifications,
  EmailVerification as DrizzleEmailVerification,
} from '@/core/infra/db/schema'

import { createEmailVerification } from '@identity/domain/entities'

export class EmailVerificationMapper {
  static toDomain(raw: DrizzleEmailVerification): EmailVerification {
    return createEmailVerification({ ...raw }, raw.id)
  }

  static toPersistence(
    emailVerification: EmailVerification
  ): typeof emailVerifications.$inferInsert {
    return {
      id: emailVerification.id,
      userId: emailVerification.userId,
      code: emailVerification.code,
      expires: emailVerification.expires,
      isUsed: emailVerification.isUsed,
      createdAt: emailVerification.createdAt,
      updatedAt: emailVerification.updatedAt,
    }
  }
}
