import { Text, Heading } from '@react-email/components'

import Main from '../components/main'
import Code from '../components/code'
import { EmailStyles } from '../constants/styles'

interface Props {
  name: string
  code: string
}

export default function VerificationEmail({ name, code }: Props) {
  const { colors, typography, spacing } = EmailStyles

  return (
    <Main>
      <Heading
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.md,
        }}
      >
        🎉 Bem-vindo(a) ao Horvatti Champ!
      </Heading>

      <Text
        style={{
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Olá <strong>{name}</strong>,
      </Text>

      <Text
        style={{
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
          marginTop: spacing.sm,
        }}
      >
        Obrigado por se cadastrar! Para ativar sua conta e começar a usar nossa plataforma, insira o
        código de verificação abaixo:
      </Text>

      <Code code={code} />

      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.error,
          marginTop: spacing.md,
        }}
      >
        ⏳ Este código expira em <strong>10 minutos</strong>.
      </Text>

      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.muted,
          marginTop: spacing.sm,
        }}
      >
        Caso não tenha criado esta conta, você pode simplesmente ignorar este e-mail.
      </Text>
    </Main>
  )
}

VerificationEmail.PreviewProps = {
  name: 'Fulano da Silva',
  code: '482913',
} satisfies Props
