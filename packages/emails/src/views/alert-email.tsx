import { Text, Link, Button, Section, Heading } from '@react-email/components'

import Main from '../components/main'
import { EmailStyles } from '../constants/styles'
import { SupportEmail } from '../constants/config'

type AlertLevel = 'info' | 'warning' | 'critical'

type Props = {
  name: string
  alertLevel: AlertLevel
  alertTitle: string
  alertMessage: string
  actionUrl?: string
  actionText?: string
}

export default function AlertEmail({
  name,
  alertLevel,
  alertTitle,
  alertMessage,
  actionUrl,
  actionText,
}: Props) {
  const { colors, typography, spacing, radius } = EmailStyles

  const currentAlert = {
    info: {
      background: '#e0f2fe',
      border: '#7dd3fc',
      icon: 'ℹ️',
      text: '#0369a1',
    },
    warning: {
      background: '#fef3c7',
      border: '#fcd34d',
      icon: '⚠️',
      text: '#b45309',
    },
    critical: {
      background: '#fee2e2',
      border: '#fca5a5',
      icon: '🚨',
      text: '#b91c1c',
    },
  }[alertLevel]

  return (
    <Main>
      <Heading
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.sm,
          color: currentAlert.text,
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          backgroundColor: currentAlert.background,
          borderRadius: radius.md,
          borderLeft: `4px solid ${currentAlert.border}`,
          padding: spacing.xl,
          marginBottom: spacing.xl,
        }}
      >
        <span>{currentAlert.icon}</span>

        <span>{alertTitle}</span>
      </Heading>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Olá {name},
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.relaxed,
          whiteSpace: 'pre-line',
        }}
      >
        {alertMessage}
      </Text>

      {actionUrl && actionText && (
        <Section style={{ textAlign: 'center', margin: `${spacing['2xl']} 0` }}>
          <Button
            href={actionUrl}
            style={{
              backgroundColor: alertLevel === 'critical' ? colors.error : colors.primary,
              color: colors.text.white,
              padding: `${spacing.md} ${spacing.xl}`,
              borderRadius: radius.md,
              textDecoration: 'none',
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {actionText}
          </Button>
        </Section>
      )}

      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.muted,
          marginTop: spacing.xl,
        }}
      >
        Se precisar de assistência, entre em contato com nosso suporte em{' '}
        <Link href={`mailto:${SupportEmail}`} style={{ color: colors.primary }}>
          {SupportEmail}
        </Link>
        .
      </Text>
    </Main>
  )
}

AlertEmail.PreviewProps = {
  name: 'Fulano da silva',
  alertLevel: 'warning',
  alertTitle: 'Alerta de Sistema de Irrigação',
  alertMessage:
    'Detectamos um problema no sistema de irrigação do setor 3.\n\nA pressão da água está abaixo do nível recomendado, o que pode comprometer a distribuição uniforme da água nas pastagens. Recomendamos verificar o sistema o mais rápido possível.',
  actionUrl: 'http://localhost:3000/monitoramento/irrigacao/alertas/789',
  actionText: 'Ver Detalhes do Alerta',
} satisfies Props
