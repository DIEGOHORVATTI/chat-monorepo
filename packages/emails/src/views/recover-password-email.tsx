import { Text } from '@react-email/components'

import Main from '../components/main'
import Code from '../components/code'
import { EmailStyles } from '../constants/styles'

type Props = {
  code: string
  email: string
}

export default function RecoverPasswordEmail({ code, email }: Props) {
  const { colors, typography, spacing } = EmailStyles

  return (
    <Main>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Olá,
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.base,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Recebemos uma solicitação para redefinir a senha da conta associada ao e-mail <b>{email}</b>
        .
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.base,
          margin: `${spacing.lg} 0 ${spacing.sm} 0`,
        }}
      >
        Use o código abaixo para concluir o processo de recuperação:
      </Text>

      <Code code={code} />

      <Text
        style={{
          color: colors.error,
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.normal,
          marginTop: spacing.md,
        }}
      >
        ⚠️ Atenção: não compartilhe este código com ninguém.
      </Text>

      <Text
        style={{
          color: colors.text.muted,
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.normal,
          marginTop: spacing.md,
        }}
      >
        Se você não solicitou essa alteração, ignore este e-mail. Sua senha atual permanecerá
        inalterada.
      </Text>
    </Main>
  )
}

RecoverPasswordEmail.PreviewProps = {
  code: '482913',
  email: 'usuario@horvattichamp.com.br',
} satisfies Props
