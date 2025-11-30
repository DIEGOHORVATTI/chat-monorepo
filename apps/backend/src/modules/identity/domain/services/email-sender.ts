import type { User } from '../entities'

export type SendVerificationEmailData = Pick<User, 'email' | 'name'> & { code: string }

export type EmailNotificationService = {
  sendVerificationEmail(props: SendVerificationEmailData): Promise<void>
}
