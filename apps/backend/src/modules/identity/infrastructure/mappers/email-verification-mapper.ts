import type { EmailVerification } from '@identity/domain/entities'
import type { EmailVerification as PrismaEmailVerification } from '@prisma/client'

import { createEmailVerification } from '@identity/domain/entities'

export class EmailVerificationMapper {
  static toDomain(raw: PrismaEmailVerification): EmailVerification {
    return createEmailVerification({ ...raw }, raw.id)
  }

  static toPersistence(emailVerification: EmailVerification): PrismaEmailVerification {
    return {
      ...emailVerification,
    }
  }
}
