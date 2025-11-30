import type {
  EmailNotificationService,
  SendVerificationEmailData,
} from '@/modules/identity/domain/services'

import { ENV } from '@repo/service-core'
import { render } from '@react-email/render'
import { VerificationEmail } from '@repo/emails'
import { transporter } from '@/core/infra/email-transporter'

export const makeEmailNotificationService = (): EmailNotificationService => ({
  sendVerificationEmail: async ({
    email,
    name,
    code,
  }: SendVerificationEmailData): Promise<void> => {
    const emailHtml = await render(VerificationEmail({ name, code }))

    await transporter.sendMail({
      to: email,
      from: ENV.EMAIL.EMAIL_FROM,
      subject: 'Verificação de Email - Horvatti Champ',
      html: emailHtml,
    })
  },
})
