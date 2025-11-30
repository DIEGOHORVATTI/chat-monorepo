import { Hr, Link, Text, Button, Section } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'
import { SupportEmail } from '../constants/config'

type Props = {
  recipientName: string
  suspensionReason: string
  failedPaymentDate: string
  suspensionDate: string
  paymentPlan: string
  paymentAmount: string
  updatePaymentLink: string
}

export default function AccountSuspendedEmail({
  recipientName,
  suspensionReason,
  failedPaymentDate,
  suspensionDate,
  paymentPlan,
  paymentAmount,
  updatePaymentLink,
}: Props) {
  const { colors, typography, spacing, radius } = EmailStyles

  return (
    <Main>
      <Text
        style={{
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          backgroundColor: colors.warning,
          color: colors.text.white,
          fontSize: typography.fontSize.lg,
          lineHeight: typography.lineHeight.relaxed,
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        Sua conta está suspensa.
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.lg,
          lineHeight: typography.lineHeight.relaxed,
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        Oi {recipientName}, notamos que seu pagamento não deu certo e, por isso, sua conta foi
        pausada no dia {suspensionDate}. Calma: é simples de resolver.
      </Text>

      <Section
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: radius.md,
          padding: spacing.lg,
          marginBottom: spacing.lg,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing.md,
          }}
        >
          Detalhes do pagamento:
        </Text>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: spacing.sm }}>Plano: {paymentPlan}</li>
          <li style={{ marginBottom: spacing.sm }}>Valor: {paymentAmount}</li>
          <li style={{ marginBottom: spacing.sm }}>Última tentativa: {failedPaymentDate}</li>
          <li style={{ marginBottom: spacing.sm }}>Motivo: {suspensionReason}</li>
        </ul>
      </Section>

      <Button
        href={updatePaymentLink}
        style={{
          backgroundColor: colors.primary,
          color: colors.text.white,
          padding: '14px 22px',
          borderRadius: radius.md,
          fontWeight: typography.fontWeight.bold,
          fontSize: typography.fontSize.md,
          textDecoration: 'none',
          textAlign: 'center',
          display: 'block',
          margin: `${spacing.xl} auto`,
          width: '260px',
        }}
      >
        Reativar meu acesso
      </Button>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
          marginTop: spacing.lg,
          textAlign: 'center',
        }}
      >
        Se pintar qualquer dúvida, fala com a gente em{' '}
        <Link
          href={`mailto:${SupportEmail}`}
          style={{
            color: colors.primary,
            textDecoration: 'underline',
          }}
        >
          {SupportEmail}
        </Link>
      </Text>

      <Hr
        style={{
          borderTop: `1px solid ${colors.border}`,
          margin: `${spacing.xl} 0`,
        }}
      />

      <Text
        style={{
          color: colors.text.muted,
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.normal,
          textAlign: 'center',
        }}
      >
        A gente quer você curtindo a plataforma, não resolvendo burocracia. Bora resolver?
      </Text>
    </Main>
  )
}

AccountSuspendedEmail.PreviewProps = {
  recipientName: 'João Silva',
  suspensionReason: 'Falha no processamento do pagamento agendado',
  failedPaymentDate: '25/08/2025',
  suspensionDate: '31/08/2025',
  paymentPlan: 'Plano Premium Anual',
  paymentAmount: 'R$ 1.199,90',
  updatePaymentLink: 'https://example.com/atualizar-pagamento',
} satisfies Props
